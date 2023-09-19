import { set, get, del, createStore } from "idb-keyval";

export default {
  getItem: async (key, store) => {
    const value = await get(key, store);
    return value ? JSON.parse(value) : null;
  },

  setItem: async (key, value, store) => {
    return set(key, JSON.stringify(value), store);
  },
  removeItem: async (key, store) => {
    return del(key, store);
  },
  createStore: (storeName = "bootstrapp", tableName = "kv") => {
    return createStore(storeName, tableName);
  }
  
};
