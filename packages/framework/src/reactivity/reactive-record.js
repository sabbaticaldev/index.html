import Storage from "../mvc/storage-controller";

/**
 * Class representing an active record.
 */
class ReactiveRecord {
  /**
   * @param {Object} [initialState={}]
   * @param {Object} [config={}]
   */
  async init({ data, name, adapter } = {}) {
    this.name = name;
    const store = adapter && Storage[adapter] || Storage["memory"];
    this.state = new store(name);
  
    // Load initial state from storage
    for (const key in data) {
      const obj = data[key];
      const id = obj.id || key;
      const storedValue = await this.state.get(id);
      if (storedValue === null || storedValue === undefined) {
        await this.state.add(id, data[key]);
      }
    }
  }

  constructor(config) {
    this.init(config);
  }

  /**
   * Used to set a state value and notify subscribers.
   * @param {string} key 
   * @param {*} value 
   */
  async add(key, value) {
    if(typeof window !== "undefined") {
      return await this.state.add(key, {...value, id: key});      
    }
  }

  /**
   * Used to set a state value and notify subscribers.
   * @param {string} key 
   * @param {*} value 
   */
  async edit(key, value) {
    return await this.state.edit(key, value);      
  }

  async remove(key) {
    return await this.state.remove(key);      
  }

  async get(key) {
    return await this.state.get(key);
  }

  async list() {
    const list = await this.state.list(this.name+"list");    
    return list;
  }
}

export default ReactiveRecord;