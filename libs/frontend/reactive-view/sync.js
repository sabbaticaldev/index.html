// sync.js
import { hash, querystring, stringToType, url } from "helpers";

export const instances = [];
const syncAdapters = { url, localStorage, sessionStorage, hash, querystring };
export const syncKeyMap = new Map();

const getSyncKey = (key, sync) => `${key}-${sync}`;

const getSyncValue = (prop, key) => {
  if (!syncAdapters[prop.sync]) return;
  const value = syncAdapters[prop.sync].getItem(key);
  return value ? stringToType(value, prop) : prop.defaultValue;
};

export const defineSyncProperty = (instance, key, prop) => {
  const syncKey = getSyncKey(key, prop.sync);
  if (!syncKeyMap.has(syncKey)) {
    syncKeyMap.set(syncKey, new Set());
  }
  const value = getSyncValue(prop, key);
  instance[key] = value;
  syncKeyMap.get(syncKey).add(instance);
};

export const requestUpdateOnUrlChange = () => {
  syncKeyMap.forEach((instances, syncProp) => {
    const [key, syncType] = syncProp.split("-");
    if (syncProp && ["url", "hash", "querystring"].includes(syncType)) {
      instances.forEach((instance) => {
        instance[key] = syncAdapters[syncType].getItem(key);
      });
    }
  });
};
