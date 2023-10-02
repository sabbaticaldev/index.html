export const clear = (db) => {
  return db("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
};

export const createStore = (dbName = "bootstrapp") => {
  const storeName = "kv";
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) =>
    dbp.then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName)),
    );
};

export const removeMany = (keys, db) => {
  return db("readwrite", (store) => {
    keys.forEach((key) => store.delete(key));
    return promisifyRequest(store.transaction);
  });
};

export const getItem = (key, db) => {
  return db("readonly", (store) => promisifyRequest(store.get(key)));
};

export const setItem = (key, value, db) => {
  return db("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
};

export const setLastOp = async (key, value, config) => {
  const { db, propKey } = config;
  const keys = await startsWith(propKey, db, { index: true, keepKey: true });
  await removeMany(keys, db);
  setItem(key, value, db);
};

export const setMany = (entries, db) => {
  return db("readwrite", (store) => {
    entries.forEach((entry) => store.put(entry[1], entry[0]));
    return promisifyRequest(store.transaction);
  });
};

export const getMany = (keys, db) => {
  return db("readonly", (store) =>
    Promise.all(keys.map((key) => promisifyRequest(store.get(key)))),
  );
};

export const update = (key, updater, db) => {
  return db(
    "readwrite",
    (store) =>
      new Promise((resolve, reject) => {
        store.get(key).onsuccess = function () {
          try {
            store.put(updater(this.result), key);
            resolve(promisifyRequest(store.transaction));
          } catch (err) {
            reject(err);
          }
        };
      }),
  );
};

export const removeItem = (key, db) => {
  return db("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
};

export const eachCursor = (store, callback) => {
  store.openCursor().onsuccess = function () {
    if (!this.result) return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
};

export const keys = (db) => {
  return db("readonly", (store) => {
    if (store.getAllKeys) return promisifyRequest(store.getAllKeys());
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(
      () => items,
    );
  });
};

export const values = (db) => {
  return db("readonly", (store) => {
    if (store.getAll) return promisifyRequest(store.getAll());
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.value)).then(
      () => items,
    );
  });
};

export const entries = (db) => {
  return db("readonly", (store) => {
    if (store.getAll && store.getAllKeys) {
      return Promise.all([
        promisifyRequest(store.getAllKeys()),
        promisifyRequest(store.getAll()),
      ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
    }
    const items = [];
    return db("readonly", (store) =>
      eachCursor(store, (cursor) =>
        items.push([cursor.key, cursor.value]),
      ).then(() => items),
    );
  });
};

export const startsWith = (
  prefix,
  db,
  config = { index: true, keepKey: false },
) => {
  return db("readonly", (store) => {
    const range = IDBKeyRange.bound(prefix, prefix + "\uffff");
    const items = [];
    return new Promise((resolve, reject) => {
      const cursorReq = store.openCursor(range);
      cursorReq.onsuccess = function () {
        const cursor = cursorReq.result;
        if (cursor) {
          const id = config.keepKey ? cursor.key : cursor.key.split("_")[1];
          items.push(config.index ? id : { id, [prefix]: cursor.value });
          cursor.continue();
        } else {
          resolve(items);
        }
      };
      cursorReq.onerror = function () {
        reject(cursorReq.error);
      };
    });
  });
};

export const promisifyRequest = (request) => {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
};

export const getCount = (db) => {
  return db("readonly", (store) => promisifyRequest(store.count()));
};

export const isEmpty = (db) => {
  return getCount(db).then((count) => count === 0);
};

export default {
  clear,
  createStore,
  entries,
  getCount,
  isEmpty,
  getMany,
  getItem,
  keys,
  promisifyRequest,
  removeItem,
  removeMany,
  setLastOp,
  setItem,
  setMany,
  startsWith,
  update,
  values,
};
