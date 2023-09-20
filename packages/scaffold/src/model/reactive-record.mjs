import MemoryAdpter from "./adapters/memory.mjs";
import IndexeddbAdapter from "./adapters/indexeddb.mjs";
import UrlAdapter from "./adapters/url.mjs";
import SessionStorageAdpter from "./adapters/session-storage.mjs";
import LocalStorageAdapter from "./adapters/local-storage.mjs";

const adapters = {
  "memory": MemoryAdpter,
  "indexeddb": IndexeddbAdapter,
  "url": UrlAdapter,
  "sessionStorage": SessionStorageAdpter,
  "localStorage": LocalStorageAdapter
};

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
  async init({ data, name, adapter } = {}) {
    this.name = name;
    this.adapter = adapter && adapters[adapter] || adapters["memory"];
    if(this.adapter.createStore) {
      this.store = this.adapter.createStore();
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

  /**
   * @param {string} key
   * @returns {any}
   */
  async get(id) {
    const stored = await this.adapter.getItem(id, this.store);
    const value = stored ? JSON.parse(stored) : null;
    return (!value || Array.isArray(value)) ? value : {...value, id };
  }

  /**
   * @param {string} key
   * @param {any} value
   * @private
   */
  

  async _set(key, value) {
    return this.adapter.setItem(key, JSON.stringify(value), this.store);
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  async add(value) {
    const id = value?.id || this.name+generateId();
    this._set(id, { ...(value|| {}), id });
    const index = await this.get(this.name+"list") || [];    
    this._set(this.name+"list", [...(index || []), id]);    
    return Promise.resolve({ ...(value|| {}), id });
  }

  /**
   * @param {any[]} values
   */
  async addMany(values) {    
    if (!values || !values.length) return;    
    const ids = values.map(() => this.name + generateId());
    await Promise.all(ids.map(async (id, idx) => await this._set(ids[idx], { 
      ...(values[idx] || {}),
      id: ids[idx]
    })));

    const currentIndex = await this.get(this.name + "list") || [];
    await this._set(this.name + "list", [...currentIndex, ...ids]);
  }

  
  /**
   * @param {string} key
   * @param {any} value
   */
  async edit(value) {
    const key = value.id;
    let newValue = value;
    if (typeof value === "object" && value !== null) {
      const record = await this.get(key) || {};      
      newValue = {...record, ...value};
    }
    await this._set(key, newValue);
  }
  /**
   * @param {Record<string, any>[]} records
   */
  async editMany(records) {
    if (!records || !records.length) return;
    
    await Promise.all(records.map(async record => {
      const currentRecord = await this.get(record.id) || {};
      const newValue = { ...currentRecord, ...record };
      return this._set(record.id, newValue);
    }));
  }

  /**
   * @returns {any[]}
   */
  async list() {
    const index = await this.get(this.name+"list");    
    return Array.isArray(index) ? Promise.all(index.map(async (key) => await this.get(key))) : [];
  }

  async remove(key) {
    const indexKey = this.name + "list";
    const index = await this.get(indexKey);
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];    
    await this._set(this.name+"list", updatedIndex);
    return this.adapter.removeItem(key, this.store);
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