import indexeddb from "./indexeddb.mjs";
import { generateId, defineModels } from "./reactive-record.mjs";
import { fromBase62, toBase62 } from "./string.mjs";

const APP_STATE_DB = "app-state-db";

const store = indexeddb.createStore(APP_STATE_DB);

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

export const getTimestamp = async (id) => {
  let timestamp = await indexedDBWrapper.get("timestamp");
  const offset = fromBase62(id);
  return Number.parseInt(timestamp) + Number.parseInt(offset);
};

function getDefaultCRUDEndpoints(modelName, endpoints = {}) {
  return {
    [`GET /api/${modelName}`]: function () {
      return this.getMany();
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
      return this.edit({ id, ...rest });
    },
    ...endpoints,
  };
}

// Convert the endpoint string to a regular expression.
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

export async function initializeApiModel() {
  if (models && api) {
    return { models, api }; // If already initialized, return cached values
  }

  const appId = await getAppId();
  const modelList = await getModels(appId);
  models = defineModels(modelList, appId);
  api = Object.entries(modelList).reduce((acc, [name, model]) => {
    const endpoints = getDefaultCRUDEndpoints(name, model.endpoints);
    Object.entries(endpoints).forEach(([endpoint, callback]) => {
      const regex = endpointToRegex(endpoint);
      acc[String(endpoint)] = {
        regex,
        model: models[name],
        callback,
      };
    });
    return acc;
  }, {});

  return { models, api };
}

export default {
  initializeApiModel,
  getAppId,
  getUserId,
  generateId,
  getTimestamp,
  getModels,
  setModels,
};
