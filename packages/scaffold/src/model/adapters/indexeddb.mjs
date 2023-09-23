/**
 * Clears all values in the store.
 *
 * @param {Function} [customStore=defaultGetStore()] - Method to get a custom store. Use with caution (see the docs).
 * @returns {Promise} - Promise that resolves when the store is cleared.
 */
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}

/**
 * Create a new store or open an existing one.
 *
 * @param {string} [dbName="bootstrapp"] - The name of the database.
 * @param {string} [storeName="kv"] - The name of the store.
 * @returns {Function} - A function that accepts a transaction mode and a callback to handle the store.
 */
function createStore(dbName = "bootstrapp", storeName = "kv") {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}

/**
 * Delete multiple keys at once.
 *
 * @param {Array} keys - List of keys to delete.
 * @param {Function} [customStore=defaultGetStore()] - Method to get a custom store. Use with caution (see the docs).
 * @returns {Promise} - Promise that resolves when the keys are deleted.
 */
function removeMany(keys, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    keys.forEach((key) => store.delete(key));
    return promisifyRequest(store.transaction);
  });
}

let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function getItem(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function setItem(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function setMany(entries, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    entries.forEach((entry) => store.put(entry[1], entry[0]));
    return promisifyRequest(store.transaction);
  });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function getMany(keys, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function update(key, updater, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => 
    // Need to create the promise manually.
    // If I try to chain promises, the transaction closes in browsers
    // that use a promise polyfill (IE10/11).
    new Promise((resolve, reject) => {
      store.get(key).onsuccess = function () {
        try {
          store.put(updater(this.result), key);
          resolve(promisifyRequest(store.transaction));
        }
        catch (err) {
          reject(err);
        }
      };
    }));
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function removeItem(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}

function eachCursor(store, callback) {
  store.openCursor().onsuccess = function () {
    if (!this.result)
      return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function keys(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    // Fast path for modern browsers
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
  });
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function values(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    // Fast path for modern browsers
    if (store.getAll) {
      return promisifyRequest(store.getAll());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.value)).then(() => items);
  });
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function entries(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    // Fast path for modern browsers
    // (although, hopefully we'll get a simpler path some day)
    if (store.getAll && store.getAllKeys) {
      return Promise.all([
        promisifyRequest(store.getAllKeys()),
        promisifyRequest(store.getAll()),
      ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
    }
    const items = [];
    return customStore("readonly", (store) => eachCursor(store, (cursor) => items.push([cursor.key, cursor.value])).then(() => items));
  });
}

/**
 * Get all entries in the store whose keys start with the specified prefix.
 *
 * @param prefix The prefix to match against keys in the store.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function startsWith(prefix, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    const range = IDBKeyRange.bound(prefix, prefix + "\uffff");
    const items = [];

    return new Promise((resolve, reject) => {
      const cursorReq = store.openCursor(range);
      cursorReq.onsuccess = function() {
        const cursor = cursorReq.result;
        if (cursor) {
          items.push({ id: cursor.key, [prefix]: cursor.value });
          cursor.continue();
        } else {
          resolve(items);
        }
      };
      cursorReq.onerror = function() {
        reject(cursorReq.error);
      };
    });
  });
}

/**
 * Converts an IDBRequest to a promise.
 *
 * @private
 * @param {IDBRequest} request - The IDBRequest instance.
 * @returns {Promise} - Promise that resolves with the request result or rejects with the request error.
 */
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}

export { 
  clear, 
  createStore, 
  entries, 
  getMany, 
  getItem,
  keys, 
  promisifyRequest,
  removeItem,
  removeMany,
  setItem,
  setMany, 
  startsWith,
  update, 
  values 
};