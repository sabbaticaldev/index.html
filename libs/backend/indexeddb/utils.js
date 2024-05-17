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
