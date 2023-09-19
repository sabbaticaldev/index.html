import { set, get, del, createStore } from "idb-keyval";

const customStore = createStore("bootstrapp", "kv");
export default {
  getItem: async (key) => {
    const value = await get(key, customStore);
    return value ? JSON.parse(value) : null;
  },

  setItem: async (key, value) => {
    return set(key, JSON.stringify(value), customStore);
  },
  removeItem: async (key) => {
    return del(key, customStore);
  }
};
