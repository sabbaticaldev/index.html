/**
 * @interface
 */
class StorageStrategy {
  constructor(modelName) {
    this.modelName = modelName;
    this.isServer = typeof window === "undefined";
  }

  /**
   * @param {string} key
   * @returns {any}
   */
  get(key) {}


  /**
   * @returns {any[]}
   */
  list() {
    return [];
  }

  /**
   * @param {string} key
   * @param {any} value
   * @private
   */
  _set(key, value, {config}) {}



  /**
   * @param {string} key
   * @param {any} value
   */
  add(key, value) {
    this._set(key, value);
    const index = this.get(this.modelName+"list", { noSuffix: true }) || []; 
    index.push(key);
    this._set(this.modelName+"list", index, { noSuffix: true });
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  edit(key, value) {
    if (typeof value === "object" && value !== null) {
      const record = this.get(key) || {};
      value = {...record, ...value};
    }
    this._set(key, value);
  }
}

class InMemoryStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    /** @type {Record<string, any>} */
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  list() {
    const index = this.get(this.modelName+"list", { noSuffix: true });    
    return  Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }

  _set(key, value) {
    this.storage[key] = value;
  }

  remove(key) {
    delete this.storage[key];
  }
}

class LocalStorageStrategy extends StorageStrategy {
  get(key) {
    if (this.isServer) return null;
    return JSON.parse(localStorage.getItem(key) || "{}");
  }

  list() {
    if (this.isServer) return [];
    const index = this.get(this.modelName+"list", { noSuffix: true });    
    return Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }

  _set(key, value) {
    if (this.isServer) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    if (this.isServer) return;
    const indexKey = this.modelName + "list";
    const index = this.get(indexKey, { noSuffix: true });
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];    
    this._set(this.modelName+"list", updatedIndex, { noSuffix: true });
    localStorage.removeItem(key);
  }
}

class SessionStorageStrategy extends StorageStrategy {
  get(key) {
    if (this.isServer) return null;
    const entry = sessionStorage.getItem(key);
    return entry ? JSON.parse(entry) : null;
  }

  list() {
    if (this.isServer) return [];
    const index = this.get(this.modelName+"list", { noSuffix: true });    
    return  Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }

  _set(key, value) {
    if (this.isServer) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }


  remove(key) {
    if (this.isServer) return;
    const indexKey = this.modelName + "list";
    const index = this.get(indexKey, { noSuffix: true });
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];  
    this._set(this.modelName+"list", updatedIndex, { noSuffix: true });
    sessionStorage.removeItem(key);
  }
}

class QueryStringStrategy extends StorageStrategy {
  get(key, { params, noSuffix } = {}) {
    if (this.isServer) return null;
    const value = (params || new URLSearchParams(window.location.search))?.get(noSuffix ? key : this.modelName + key);    
    return value ? JSON.parse(decodeURIComponent(value)) : null;
  }

  list() {
    if (this.isServer) return [];
    const params = new URLSearchParams(window.location.search);
    const index = this.get(this.modelName+"list", { params, noSuffix: true });    
    return Array.isArray(index) ? index.map(key => this.get(key, { params })) : [];
  }
  

  _set(key, value, { noSuffix } = {}) {
    if (this.isServer) return;
    const params = new URLSearchParams(window.location.search);
    const idx = noSuffix ? key : this.modelName + key;
    params.set(idx, encodeURIComponent(JSON.stringify(value)), { noSuffix });
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  /**
   * @param {string} key
   */  
  remove(key) {
    if (this.isServer) return;
    const id = this.modelName+key;
    const params = new URLSearchParams(window.location.search);
    const index = this.get(this.modelName + "list", { params, noSuffix: true });
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];
    params.delete(id);
    params.set(this.modelName + "list", encodeURIComponent(JSON.stringify(updatedIndex)));
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }
}

const Adapters = {
  "memory": InMemoryStrategy,
  "url": QueryStringStrategy,
  "sessionStorage": SessionStorageStrategy,
  "localStorage": LocalStorageStrategy
};

export default Adapters;
