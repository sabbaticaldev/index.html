export default {
  getItem: async (key) => Promise.resolve(localStorage.getItem(key)),
  getMany: async (keys) => {
    return keys.map(key => localStorage.getItem(key));
  },
  setItem: async (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: async (key) => Promise.resolve(localStorage.removeItem(key)), 
};
  