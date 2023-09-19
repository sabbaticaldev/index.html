export default {
  getItem: async (key) => Promise.resolve(this.data?.[key]),
  setItem: async (key, value) => {
    if(!this.data) 
      this.data = [];
    this.data[key] = value;
    Promise.resolve({key, value});
  },
  removeItem: async (key) =>  {
    delete this.data[key];
    Promise.resolve({key});
  }
  
};
  