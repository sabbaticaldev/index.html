import indexeddb from "./indexeddb.mjs";
import { defineModels } from "./reactive-record.mjs";
import { generateId, fromBase62, toBase62 } from "./string.mjs";

const APP_STATE_DB = "app-state-db";

const store = indexeddb.createStore(APP_STATE_DB);

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
    const appData = (await indexeddb.getItem(appId, store)) || {};
    return prop ? appData[prop] : appData;
  },
  set: async (appId, data) => {
    const currentData = (await indexeddb.getItem(appId, store)) || {};
    const updatedData = { ...currentData, ...data };
    return await indexeddb.setItem(appId, updatedData, store);
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

export const setAppId = async (appId) => {
  await indexedDBWrapper.set("default", { appId });
};

export const getUserId = async (appId) => {
  let userId = await indexedDBWrapper.get(appId, "userId");
  if (!userId) {
    userId = generateId(appId);
    await indexedDBWrapper.set(appId, { userId });
  }
  return userId;
};

export const getModels = async (appId) => {
  return (await indexedDBWrapper.get(appId, "models")) || {};
};

export const setModels = async (appId, models) => {
  await indexedDBWrapper.set(appId, { models });
  return models;
};

export const getControllers = async (appId) => {
  return (await indexedDBWrapper.get(appId, "controllers")) || {};
};

export const setControllers = async (appId, controllers) => {
  console.log({ controllers });
  const stringifiedControllers = convertFunctionsToString(controllers);
  await indexedDBWrapper.set(appId, {
    controllers: stringifiedControllers || {},
  });
  return models;
};

export const getTimestamp = async (id) => {
  let timestamp = await indexedDBWrapper.get("timestamp");
  const offset = fromBase62(id);
  return Number.parseInt(timestamp) + Number.parseInt(offset);
};

function getDefaultCRUDEndpoints(modelName, endpoints = {}) {
  return {
    [`GET /api/${modelName}`]: function (opts) {
      return this.getMany(null, opts);
    },
    [`GET /api/${modelName}/:id`]: function ({ id }) {
      return this.get(id);
    },
    [`POST /api/${modelName}`]: function (item) {
      return this.add(item);
    },
    [`DELETE /api/${modelName}/:id`]: function ({ id }) {
      return this.remove(id);
    },
    [`PATCH /api/${modelName}/:id`]: function ({ id, ...rest }) {
      console.log({ id, rest });
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

  models = defineModels(modelList, appId);

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
  INIT_APP: async (data, { source }) => {
    let appId = data.appId;
    if (appId) {
      await setAppId(appId);
    } else {
      appId = await getAppId();
    }
    const userId = await getUserId(appId);

    source.postMessage({
      type: "INIT_APP",
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
  getUserId,
  generateId,
  getTimestamp,
  getModels,
  setModels,
  messageHandler,
};
