import indexeddb from "./indexeddb.mjs";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const fromBase62 = (str) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = BASE62.indexOf(char);
    num = num * 62 + index;
  }
  return num;
};

export const toBase62 = (num) => {
  if (num === 0) return BASE62[0];
  let arr = [];
  while (num) {
    arr.unshift(BASE62[num % 62]);
    num = Math.floor(num / 62);
  }
  return arr.join("");
};

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

const generateIdByTimestamp = (timestamp) => {
  if (!timestamp) {
    throw new Error(
      "Reference timestamp not set. Ensure getAppId has been called first.",
    );
  }

  const timeDifference = Date.now() - parseInt(timestamp, 10);
  let id = toBase62(timeDifference);

  while (id.length < 5) {
    id = "0" + id;
  }
  return id;
};

let storedLastId;

export const generateId = (appId) => {
  const referenceTimestamp = fromBase62(appId);
  let randomNumber = Math.floor(Math.random() * 100) + 1;
  let id = generateIdByTimestamp(referenceTimestamp + randomNumber);
  if (id === storedLastId) {
    console.log({ id, storedLastId });
    id = generateIdByTimestamp(referenceTimestamp + 1);
    console.log({ id, storedLastId });
  }

  storedLastId = id;
  return id;
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

export default {
  getAppId,
  getUserId,
  generateId,
  getTimestamp,
  getModels,
  setModels,
};
