export default {
  getItem: async function(key) {
    if(!this.data)
      this.data = [];
    return Promise.resolve(this.data?.[key]);
  },
  getMany: async (keys) => {
    return keys.map(key => this.data?.[key]);
  },
  setItem: async function(key, value) {
    if(!this.data) 
      this.data = [];
    this.data[key] = value;
    return Promise.resolve({key, value});
  },
  removeItem: async function(key) {
    delete this.data[key];
    return Promise.resolve({key});
  }
};
  