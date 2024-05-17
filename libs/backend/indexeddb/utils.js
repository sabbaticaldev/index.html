const promisifyRequest = (request) =>
  new Promise((resolve, reject) => {
    if (request instanceof IDBRequest) {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } else if (request instanceof IDBTransaction) {
      request.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
      request.onabort = () => reject(request.error);
    } else {
      console.log({ request });
      reject(new Error("Invalid request or transaction"));
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

const entries = (table) =>
  tableOperation(table, "readonly", (store) =>
    store.getAll && store.getAllKeys
      ? Promise.all([
        promisifyRequest(store.getAllKeys()),
        promisifyRequest(store.getAll()),
      ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]))
      : iterateCursor(store.openCursor(), processEntries)
  );

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
