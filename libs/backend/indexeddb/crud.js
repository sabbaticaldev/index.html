import { promisifyRequest, startsWith } from "./utils";

const getItem = (key, table) => table("readonly", (store) => promisifyRequest(store.get(key)));
const get = (keys, table) => table("readonly", (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
const set = (entries, table) => table("readwrite", (store) => {  
  entries.forEach(([key, value]) => store.put(value, key));
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
