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
  instance.constructor.properties[key].hasChanged = (newValue, oldValue) => {
    const value = syncAdapters[prop.sync].getItem(key);
    if (newValue !== value) {
      syncAdapters[prop.sync].setItem(key, newValue);
    }
    return oldValue !== newValue;
  };

  const value = getSyncValue(prop, key);
  instance[key] = value;
  syncKeyMap.get(syncKey).add(instance);
};

// TODO: sessionStorage and localStorage isnt syncing when changing - it should sync not in one tab but in other tabs/windows
export const requestUpdateOnUrlChange = () => {
  syncKeyMap.forEach((instances, syncProp) => {
    const [key, syncType] = syncProp.split("-");
    if (syncProp && ["url", "hash", "querystring"].includes(syncType)) {
      const value = syncAdapters[syncType].getItem(key);
      instances.forEach((instance) => {
        if (instance[key] !== value) instance[key] = value;
      });
    }
  });
};
