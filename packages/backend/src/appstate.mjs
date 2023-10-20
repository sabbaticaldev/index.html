import idbAdapter from "./indexeddb.mjs";
import { defineModels } from "./reactive-record.mjs";
import { generateId, fromBase62, toBase62 } from "./string.mjs";

const APP_STATE_DB = "app-state-db";

const store = idbAdapter.createStore(APP_STATE_DB);

const convertFunctionsToString = (obj) => {
  let newObj = {};

  for (let key in obj) {
    if (typeof obj[key] === "function") {
      // If the current property is a function, convert it to a string
      newObj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      // If the current property is an object (including arrays), recursively process it
      newObj[key] = convertFunctionsToString(obj[key]);
    } else {
      // For other data types, just copy the value
      newObj[key] = obj[key];
    }
  }

  return newObj;
};
const indexedDBWrapper = {
  get: async (appId, prop = null) => {
    const appData = (await idbAdapter.getItem(appId, store)) || {};
    return prop ? appData[prop] : appData;
  },
  set: async (appId, data) => {
    const currentData = (await idbAdapter.getItem(appId, store)) || {};
    const updatedData = { ...currentData, ...data };
    return await idbAdapter.setItem(appId, updatedData, store);
  },
};

export const getAppId = async () => {
  let appId = await indexedDBWrapper.get("default", "appId");
  if (!appId) {
    const timestamp = Date.now();
    appId = toBase62(timestamp);
    await setAppId(appId);
    await indexedDBWrapper.set(appId, { userId: 1 });
  }
  return appId;
};

export let userId;

export const getUserId = async () => {
  userId = await indexedDBWrapper.get("default", "userId");
  return userId;
};

export const setAppId = async (appId) => {
  await indexedDBWrapper.set("default", { appId });
};
export const getModel = async (model) => {
  const { models } = await getApiModel();
  return models[model];
};

export const getModels = async (appId) => {
  const models =
    (await indexedDBWrapper.get(appId + "-models", "models")) || {};
  console.log({ models, key: appId + "-models" });
  return models;
};

export const setModels = async (appId, models) => {
  await indexedDBWrapper.set(appId + "-models", { models });
  return models;
};

export const getControllers = async (appId) => {
  return (
    (await indexedDBWrapper.get(appId + "-controllers", "controllers")) || {}
  );
};

export const setControllers = async (appId, controllers) => {
  const stringifiedControllers = convertFunctionsToString(controllers);
  await indexedDBWrapper.set(appId + "-controllers", {
    controllers: stringifiedControllers || {},
  });
  return models;
};

let timestamp;
export const getBaseTimestamp = async () => {
  if (timestamp) return timestamp;
  const appId = await getAppId();
  timestamp = fromBase62(appId);
  return timestamp;
};

function getDefaultCRUDEndpoints(modelName, endpoints = {}) {
  return {
    [`GET /api/${modelName}`]: function (opts) {
      return this.getMany(null, opts);
    },
    [`GET /api/${modelName}/:id`]: function ({ id, ...opts }) {
      return this.get(id, opts);
    },
    [`POST /api/${modelName}`]: function (item) {
      return this.add(item);
    },
    [`DELETE /api/${modelName}/:id`]: function ({ id }) {
      return this.remove(id);
    },
    [`PATCH /api/${modelName}/:id`]: function ({ id, ...rest }) {
      return this.edit({ id, ...rest });
    },
    ...endpoints,
  };
}

const endpointToRegex = (endpoint) => {
  const [method, path] = endpoint.split(" ");
  const regexPath = path
    .split("/")
    .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
    .join("/");
  return new RegExp(`^${method} ${regexPath}$`);
};

export let models;
export let api;

export async function getApiModel() {
  if (models && api) {
    return { models, api };
  }

  const appId = await getAppId();
  const modelList = await getModels(appId);
  const controllerList = await getControllers(appId);
  if (!models) models = defineModels(modelList, appId, userId);
  // Using modelList to generate the api
  api = Object.entries(modelList).reduce((acc, [name, model]) => {
    const endpoints = getDefaultCRUDEndpoints(name, model.endpoints);
    Object.entries(endpoints).forEach(([endpoint, callback]) => {
      const regex = endpointToRegex(endpoint);
      acc[endpoint] = {
        regex,
        model: models[name],
        callback,
      };
    });
    return acc;
  }, {});

  // Enhancing or adding to the api using controllerList
  Object.values(controllerList).forEach((controller) => {
    Object.entries(controller).forEach(([endpoint, callback]) => {
      const regex = endpointToRegex(endpoint);
      // Assuming you want to override if the endpoint already exists
      api[endpoint] = {
        regex,
        models,
        callback: typeof callback === "string" ? eval(callback) : callback,
      };
    });
  });

  return { models, api };
}

const messageHandlers = {
  INIT_BACKEND: async (data, { source }) => {
    console.log("DEBUG: INIT_BACKEND");
    let appId = data.appId;
    if (appId) {
      await setAppId(appId);
    } else {
      appId = await getAppId();
    }

    const modelList = data.models;
    userId = await indexedDBWrapper.get(appId, "userId");
    if (!userId) {
      userId = generateId(appId);
    }
    models = defineModels(modelList, appId, userId);
    await indexedDBWrapper.set(appId, { userId });
    const usersModel = models.users;
    if (usersModel) {
      await usersModel.add({ id: userId, name: "user" });
    }
    source.postMessage({
      type: "BACKEND_INITIALIZED",
      appId,
      userId,
    });
  },

  SYNC_DATA: async (data, { requestUpdate }) => {
    const { data: syncData } = data;
    for (let [modelName, entries] of Object.entries(syncData)) {
      const { models } = await getApiModel();
      const model = models[modelName];
      if (model) model?.setMany(entries);
    }

    requestUpdate();
  },

  REQUEST_UPDATE: async (data, { requestUpdate }) => {
    const { store } = data || {};
    requestUpdate(store);
  },

  OPLOG_WRITE: async (data, { requestUpdate, P2P }) => {
    const { bridge, store, modelName, key, value } = data;
    const { models } = await getApiModel();
    const model = models[modelName];
    if (model) {
      if (value) {
        await model.setItem(key, value);
      } else {
        await model.removeItem(key);
      }

      // TODO: When sending the message to another user, we need to append the user id who sent it
      if (!bridge)
        P2P.postMessage({ type: "OPLOG_WRITE", store, modelName, key, value });

      if (data.requestUpdate) requestUpdate();
    }
  },
};

export const messageHandler =
  ({ requestUpdate, P2P }) =>
    async (event) => {
      const handler = messageHandlers[event.data.type];
      if (handler) {
        console.log("DEBUG: Received bridge-message from Web Worker: ", {
          event,
        });
        try {
          const messageHandlerContext = {
            source: event.source,
            requestUpdate,
            P2P,
          };
          await handler(event.data, messageHandlerContext);
        } catch (error) {
          console.error(`Error handling ${event.data.type}:`, error);
        }
      }
    };

export default {
  getApiModel,
  getAppId,
  generateId,
  getModels,
  setModels,
  messageHandler,
};
