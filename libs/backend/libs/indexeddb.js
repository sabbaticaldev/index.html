const promisifyRequest = (request) =>
  new Promise((resolve, reject) => {
    if ("onsuccess" in request && "onerror" in request) {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error(`IDBRequest error: ${request.error?.message}`, request);
        reject(request.error);
      };
    } else if ("oncomplete" in request && "onerror" in request && "onabort" in request) {
      request.oncomplete = () => resolve();
      request.onerror = () => {
        console.error(`IDBTransaction error: ${request.error?.message}`, request);
        reject(request.error);
      };
      request.onabort = () => {
        console.error(`IDBTransaction abort: ${request.error?.message}`, request);
        reject(request.error);
      };
    } else {
      if(request.error){
        console.error("Invalid request or transaction", request);
        reject(new Error("Invalid request or transaction"));
      }
      else resolve(request);
    }
  });

const iterateCursor = (request, process) =>
  new Promise((resolve, reject) => {
    const items = [];
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        process(items, cursor);
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    request.onerror = () => reject(request.error);
  });

const tableOperation = (table, mode, operation) =>
  table(mode, (store) => promisifyRequest(operation(store)));

const processKeys = (items, cursor) => items.push(cursor.key);
const processValues = (items, cursor) => items.push(cursor.value);
const processEntries = (items, cursor) => items.push([cursor.key, cursor.value]);

Array.prototype.toObject = function() {
  let id;
  const obj = this.reduce((acc, [key, value]) => {
    const keys = key.split("_");
    id = keys[1];    
    acc[keys[0]] = value;
    return acc;
  }, {});
  obj.id = id;
  return obj;
};

const entries = (table) =>
  tableOperation(table, "readonly", (store) =>
    store.getAll && store.getAllKeys
      ? Promise.all([
        promisifyRequest(store.getAllKeys()),
        promisifyRequest(store.getAll()),
      ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]))
      : iterateCursor(store.openCursor(), processEntries)
  ).then(result => {
    result.__proto__ = Array.prototype;
    return result;
  });
const startsWith = (prefix, table, { index = true, keepKey = false } = {}) =>
  table("readonly", (store) => {
    const range = IDBKeyRange.bound(prefix, prefix + "\uffff");
    return iterateCursor(store.openCursor(range), (items, cursor) => {
      const id = keepKey ? cursor.key : cursor.key.split("_")[1];
      items.push(index ? id : { id, [prefix]: cursor.value });
    });
  });

const getCount = (table) => tableOperation(table, "readonly", (store) => store.count());
const isEmpty = (table) => getCount(table).then((count) => count === 0);
const clear = (table) => tableOperation(table, "readwrite", (store) => store.clear());
const keys = (table) => tableOperation(table, "readonly", (store) =>
  store.getAllKeys ? promisifyRequest(store.getAllKeys()) : iterateCursor(store.openCursor(), processKeys)
);
const values = (table) => tableOperation(table, "readonly", (store) =>
  store.getAll ? promisifyRequest(store.getAll()) : iterateCursor(store.openCursor(), processValues)
);

export {
  clear,
  entries,
  getCount,
  isEmpty,
  keys,
  promisifyRequest,
  startsWith,
  tableOperation,
  values
};


const getItem = (key, table) => table("readonly", (store) => promisifyRequest(store.get(key)));
const get = (keys, table) => table("readonly", (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
const set = (entries, table) => table("readwrite", (store) => {
  entries.forEach(([key, value]) => {
    console.log(`Putting key: ${key}, value: ${value}`);
    store.put(value, key);
  });
  console.log("All entries put in store. Awaiting transaction completion.");
  return promisifyRequest(store.transaction);
});
const remove = (keys, table) => table("readwrite", (store) => {
  keys.forEach((key) => store.delete(key));
  return promisifyRequest(store.transaction);
});
const update = (key, updater, db) => db("readwrite", (store) =>
  promisifyRequest(store.get(key)).then((result) => {
    store.put(updater(result), key);
    return promisifyRequest(store.transaction);
  })
);
const setLastOp = async (key, value, { db, propKey }) => {
  const keys = await startsWith(propKey, db, { index: true, keepKey: true });
  await remove(keys, db);
  set([[key, value]], db);
};

export {
  get,
  getItem,
  remove,
  set,
  setLastOp,
  update
};
  
const createStore = (dbName = "bootstrapp", storeName = "kv") => {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
};

export const getApp = async (dbName = "default", store = "app") => {
  const db = createStore(dbName, store);
  const appData = await entries(db);
  
  if (appData.length === 0) {
    console.error("No app data found in IndexedDB");
    return null;
  } else {
    return appData.toObject();
  }
};


export const createDatabase = (dbName = "bootstrapp", storeNames = ["kv"], version = 1) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      storeNames.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      });
    };
    request.onerror = (event) => reject(new Error(`IndexedDB error: ${event.target.error}`));
    request.onsuccess = (event) => {
      const db = event.target.result;
      const stores = storeNames.reduce((acc, storeName) => {
        acc[storeName] = (txMode, callback) => new Promise((resolve, reject) => {
          try {
            const transaction = db.transaction(storeName, txMode);
            const objectStore = transaction.objectStore(storeName);
            Promise.resolve(callback(objectStore)).then(resolve).catch(reject);
          } catch (error) {
            reject(new Error("Transaction failed", error));
          }
        });
        return acc;
      }, {});
      resolve(stores);
    };
  });

const checkStoreExists = async (dbName) => {
  if (!indexedDB.databases) {
    console.error("indexedDB.databases() is not supported in this browser.");
    return false;
  }
  const databases = await indexedDB.databases();
  return databases.some(db => db.name === dbName);
};

const idbAdapter = {
  clear,
  entries,
  values,
  getCount,
  startsWith,
  keys,
  isEmpty,
  createStore,
  checkStoreExists,
  createDatabase,
  get,
  getItem,
  remove,
  set,
  setLastOp,
  update,
  getApp
};

export default idbAdapter;
