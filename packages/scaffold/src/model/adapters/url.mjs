export default {
  getItem: async (key) => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(key);
    return Promise.resolve(value ? JSON.parse(decodeURIComponent(value)) : null);        
  },

  setItem: async (key, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, encodeURIComponent(JSON.stringify(value)));
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    return Promise.resolve({key});
  },
  removeItem: async (key) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    return Promise.resolve({key});
  }
};
  