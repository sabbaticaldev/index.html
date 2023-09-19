export default {
  getItem: async (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: async (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: async (key) => Promise.resolve(localStorage.removeItem(key)), 
};
  