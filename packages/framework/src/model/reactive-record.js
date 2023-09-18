import Storage from "../controller/storage.controller";

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
    this.storage = new store(name);
    
    // Load initial state from storage
    if(data) {
      const storedValue = await this.storage.get(name+"list");
      if (!storedValue) {
        this.storage.addMany(data);
      }
    }
  }

  constructor(config) {
    this.init(config);
  }

  async add(value) {
    return await this.storage.add(value);    
  }

  async edit(value) {
    return await this.storage.edit(value.id, value);      
  }


  async addMany(values) {
    return await this.storage.addMany(values);
  }

  async editMany(records) {
    return await this.storage.editMany(records);      
  }

  async remove(id) {
    return await this.storage.remove(id);
  }

  async get(id) {
    return await this.storage.get(id);
  }

  async list() {
    const list = await this.storage.list(this.name+"list");    
    return list;
  }
}

export default ReactiveRecord;