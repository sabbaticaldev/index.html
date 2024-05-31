// sync.js
import { stringToType, url } from "helpers";

export const instances = [];
const isServer = typeof localStorage === "undefined";
const syncAdapters = isServer ? { url } : { url, localStorage, sessionStorage };
export const syncKeyMap = new Map();

const getSyncKey = (key, sync) => ({ key, sync });

const getValueFromSync = (prop, key) => {
  const value = syncAdapters[prop.sync].getItem(prop.key || key);
  return value ? stringToType(value, prop) : prop.defaultValue;
};

const setValueInSync = (instance, key, newValue, prop) => {
  if (!prop.readonly) {
    const value = newValue
      ? typeof newValue === "string"
        ? newValue
        : JSON.stringify(newValue)
      : null;
    const currentValue = instance[key];
    if (currentValue !== value) {
      syncAdapters[prop.sync].setItem(prop.key || key, value);
      instance[key] = value;
      instance.requestUpdate();
      const instances = syncKeyMap.get(getSyncKey(key, prop.sync));
      if (instances)
        instances.forEach((syncInstance) => {
          if (syncInstance === instance) return;
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
  syncKeyMap.forEach((instances, syncKey) => {
    if (syncKey.sync === "url") {
      instances.forEach((instance) => {
        instance.requestUpdate();
      });
    }
  });
};
