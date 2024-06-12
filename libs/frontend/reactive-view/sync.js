// sync.js
import { hash, querystring, stringToType, url } from "helpers";

export const instances = [];
const isServer = typeof localStorage === "undefined";
const syncAdapters = isServer
  ? {}
  : { url, localStorage, sessionStorage, hash, querystring };
export const syncKeyMap = new Map();

const getSyncKey = (key, sync) => `${key}-${sync}`;

const getValueFromSync = (prop, key) => {
  if (!syncAdapters[prop.sync]) return;
  const value = syncAdapters[prop.sync].getItem(prop.key || key);
  return value ? stringToType(value, prop) : prop.defaultValue;
};

const setValueInSync = (instance, key, newValue, prop) => {
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
  const getValue = () => getValueFromSync(prop, key);
  const setValue = (newValue) => setValueInSync(instance, key, newValue, prop);

  if (!syncKeyMap.has(syncKey)) {
    syncKeyMap.set(syncKey, new Set());
  }
  syncKeyMap.get(syncKey).add(instance);

  Object.defineProperty(instance, key, {
    get: getValue,
    set: setValue,
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
