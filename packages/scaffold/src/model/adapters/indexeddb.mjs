import { set, get, del, createStore } from "./idb-keyval.mjs";

export default {
  getItem: async (key, store) => {
    return await get(key, store);    
  },

  getMany: async (keys, store) => {
    return Promise.all(keys.map(key => get(key, store)));
  },
  setItem: async (key, value, store) => {
    return set(key, value, store);
  },
  removeItem: async (key, store) => {
    return del(key, store);
  },
  createStore: (storeName = "bootstrapp", tableName = "kv") => {
    return createStore(storeName, tableName);
  }
  
};
