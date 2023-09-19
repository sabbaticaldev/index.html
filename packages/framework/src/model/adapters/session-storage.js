export default {
  getItem: async (key) => Promise.resolve(sessionStorage.getItem(key)),
  setItem: async (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
  removeItem: async (key) => Promise.resolve(sessionStorage.removeItem(key)), 
};
  