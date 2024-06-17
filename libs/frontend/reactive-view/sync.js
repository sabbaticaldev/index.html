// sync.js
import { hash, querystring, stringToType, url } from "helpers";

export const instances = [];
const syncAdapters = { url, localStorage, sessionStorage, hash, querystring };
export const syncKeyMap = new Map();

const getSyncKey = (key, sync) => `${key}-${sync}`;

const getSyncValue = (prop, key) => {
  if (!syncAdapters[prop.sync]) return;
  const value = syncAdapters[prop.sync].getItem(prop.key || key);
  return value ? stringToType(value, prop) : prop.defaultValue;
};

const setSyncValue = (instance, key, newValue, prop) => {
  if (!syncAdapters[prop.sync]) return;
  if (!prop.readonly) {
    const value = newValue
      ? typeof newValue === "string"
        ? newValue
        : JSON.stringify(newValue)
      : null;
    const currentValue = instance[key];
    if (currentValue !== value) {
      syncAdapters[prop.sync].setItem(prop.key || key, value);
      const syncKey = getSyncKey(key, prop.sync);
      const instances = syncKeyMap.get(syncKey);
      if (instances)
        instances.forEach((syncInstance) => {
          if (!(syncInstance === instance && syncInstance[key] === value)) {
            syncInstance[key] = value;
          }
          syncInstance.requestUpdate();
        });
    }
  }
};

export const defineSyncProperty = (instance, key, prop) => {
  const syncKey = getSyncKey(key, prop.sync);
  if (!syncKeyMap.has(syncKey)) {
    syncKeyMap.set(syncKey, new Set());
  }
  syncKeyMap.get(syncKey).add(instance);
  Object.defineProperty(instance, key, {
    get: () => getSyncValue(prop, key),
    set: (newValue) => {
      setSyncValue(instance, key, newValue, prop);
    },
    configurable: true,
  });
};

export const requestUpdateOnUrlChange = () => {
  syncKeyMap.forEach((instances, syncProp) => {
    const syncValue = typeof syncProp === "string" ? syncProp : syncProp.sync;

    if (
      syncValue &&
      (["url", "hash", "querystring"].includes(syncValue) ||
        syncValue.endsWith("-url") ||
        syncValue.endsWith("-hash") ||
        syncValue.endsWith("-querystring"))
    ) {
      instances.forEach((instance) => {
        instance.requestUpdate();
      });
    }
  });
};
