import { setItem, removeItem, getItem, getMany, createStore, startsWith } from "./adapters/indexeddb.mjs";


const generateId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return Array.from({ length: 5 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

/**
 * Class representing an active record.
 */
class ReactiveRecord {
  /**
   * @param {Object} [initialState={}]
   * @param {Object} [config={}]
   */
  async init({ data, name, properties } = {}) {
    this.name = name;
    this.adapter = { setItem, removeItem, getItem, getMany, createStore, startsWith };
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    if(this.adapter.createStore) {
      this.store = this.adapter.createStore("bootstrapp", name);
    }
    // Load initial state from storage    
    if(data) {
      const storedValue = await this.list();
      if (!storedValue?.length) {
        this.addMany(data);
      }
    }
  }

  constructor(config) {
    this.init(config);
  }

  async get(id, selectedProps) {
    const properties = selectedProps || Object.keys(this.properties);
    const keys = properties.map(prop => `${prop}_${id}`);
    const values = await this.adapter.getMany(keys, this.store);
    const obj = { id };
    properties.forEach((prop, idx) => {
      obj[prop] = values[idx];
    });
    return obj;
  }

  async _set(key, value) {
    return this.adapter.setItem(key, value, this.store);
  }

  async add(value) {
    const id = value?.id || generateId();
    const properties = Object.keys(value);
    if(!properties[this.referenceKey]) {
      properties[this.referenceKey] = "";
    }
    await Promise.all(properties.map(prop => 
      this._set(`${prop}_${id}`, value[prop])
    ));

    return { ...value, id };
  }

  async addMany(values) {
    if (!values || !values.length) return;
    const ids = values.map(generateId);
    await Promise.all(values.map((value, idx) => 
      this.add({ ...value, id: ids[idx] }, true)
    ));
  }

  
  /**
   * @param {string} key
   * @param {any} value
   */
  async edit({id, ...value}) {
    const properties = Object.keys(value);
    const updatedProperties = Object.keys(value);
    await Promise.all(updatedProperties.map(prop => 
      this._set(`${prop}_${id}`, value[prop])
    ));
    const propertiesToDelete = properties.filter(prop => !updatedProperties.includes(prop));
    await Promise.all(propertiesToDelete.map(prop => 
      this.adapter.removeItem(`${prop}_${id}`, this.store)
    ));
  }

  /**
   * @param {Record<string, any>[]} records
   */
  async editMany(records) {
    if (!records || !records.length) return;
    await Promise.all(records.map(record => this.edit(record)));
  }

  /**
   * @returns {any[]}
   */  
  async list(key) {
    return this.adapter.startsWith(key || this.referenceKey, this.store);
  }

  async remove(key) {
    const properties = Object.keys(this.properties);
    if (!properties) return;
    return Promise.all(properties.map(prop => 
      this.adapter.removeItem(`${key}_${prop}`, this.store)
    ));
  }
}



const defineModels = (models) => {
  return Object.fromEntries(
    Object.entries(models).map(([name, module]) => [
      name,
      new ReactiveRecord(module),
    ])
  );
};

export { ReactiveRecord, defineModels };