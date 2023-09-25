import { setItem, removeItem, getItem, getMany, createStore, startsWith } from "./adapters/indexeddb.mjs";


const generateId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
      const storedValue = await this.getMany();
      if (!storedValue?.length) {
        this.addMany(data);
      }
    }
  }

  constructor(config) {
    this.init(config);
  }

  async get(id, selectedProps) {
    const propNames = selectedProps || Object.keys(this.properties);
    const keys = propNames.map(prop => `${prop}_${id}`);
    const values = await this.adapter.getMany(keys, this.store);
    const obj = { id };    
    propNames.forEach((prop, idx) => {
      obj[prop] = values[idx] || this.properties[prop]?.defaultValue;
    });    
    return obj;
  }

  /**
   * @returns {any[]}
   */  
  async getMany(key, props, indexOnly = true) {
    const items = await this.adapter.startsWith(key || this.referenceKey, this.store, indexOnly);
    return indexOnly ? Promise.all(items.map(async (key) => await this.get(key, props))) : Promise.resolve(items);
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
  async edit({ id, ...value }) {
    const updatedProperties = Object.keys(value);
    await Promise.all(updatedProperties.map(prop => 
      this._set(`${prop}_${id}`, value[prop])
    ));
  }

  /**
   * @param {Record<string, any>[]} records
   */
  async editMany(records) {
    if (!records || !records.length) return;
    await Promise.all(records.map(record => this.edit(record)));
  }

  async remove(key) {
    const properties = Object.keys(this.properties);    
    if (!properties) return;
    return Promise.all(properties.map(async prop => await this.adapter.removeItem(`${prop}_${key}`, this.store)
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