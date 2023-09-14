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
    if(data) {
      const storedValue = await this.state.get(name+"list");
      if (!storedValue) {
        this.state.addBulk(data);
      }
    }
  }

  constructor(config) {
    this.init(config);
  }

  async add(value) {
    return await this.state.add(value);    
  }

  async edit(value) {
    return await this.state.edit(value.id, value);      
  }


  async addBulk(values) {
    return await this.state.addBulk(values);
  }

  async editBulk(records) {
    return await this.state.editBulk(records);      
  }

  async remove(id) {
    return await this.state.remove(id);
  }

  async get(id) {
    return await this.state.get(id);
  }

  async list() {
    const list = await this.state.list(this.name+"list");    
    return list;
  }
}

export default ReactiveRecord;