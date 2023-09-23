export default {
  getItem: async (key) => Promise.resolve(sessionStorage.getItem(key)),
  getMany: async (keys) => {
    return keys.map(key => localStorage.getItem(key));
  },
  setItem: async (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
  removeItem: async (key) => Promise.resolve(sessionStorage.removeItem(key)), 
};
  