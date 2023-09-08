/**
 * @interface
 */
class StorageStrategy {
  constructor(name) {
    this.name = name;
    this.isServer = typeof window === 'undefined';
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
    const index = this.get(this.name+"list", { noSuffix: true }) || [];
    index.push(key);
    this._set(this.name+"list", index, { noSuffix: true });
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  edit(key, value) {
    if (typeof value === 'object' && value !== null) {
      const record = this.get(key) || {};
      value = {...record, ...value};
    }
    this._set(key, value);
  }
}

class InMemoryStrategy extends StorageStrategy {
  constructor() {
    super();
    /** @type {Record<string, any>} */
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  list() {
    const index = this.get('todolist') || [];
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
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  list() {
    if (this.isServer) return [];
    const index = this.get('todolist');
    return Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }

  _set(key, value) {
    if (this.isServer) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    if (this.isServer) return;
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
    const index = this.get('todolist') || [];
    return  Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }

  _set(key, value) {
    if (this.isServer) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    if (this.isServer) return;
    sessionStorage.removeItem(key);
  }
}

class QueryStringStrategy extends StorageStrategy {
  get(key, { params, noSuffix } = {}) {
    if (this.isServer) return null;
    const value = (params || new URLSearchParams(window.location.search))?.get(noSuffix ? key : this.name + key);    
    return value ? JSON.parse(decodeURIComponent(value)) : null;
  }

  list() {
    if (this.isServer) return [];
    const params = new URLSearchParams(window.location.search);
    const index = this.get(this.name+'list', { params, noSuffix: true });
    console.log({index});
    return Array.isArray(index) ? index.map(key => this.get(key, { params })) : [];
  }
  

  _set(key, value, { noSuffix } = {}) {
    if (this.isServer) return;
    const params = new URLSearchParams(window.location.search);
    const idx = noSuffix ? key : this.name + key;
    params.set(idx, encodeURIComponent(JSON.stringify(value)), { noSuffix });
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }

  /**
   * @param {string} key
   */  
  remove(key) {
    if (this.isServer) return;
    const id = this.name+key;
    const params = new URLSearchParams(window.location.search);
    const index = this.get(this.name + "list", { params, noSuffix: true });
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];
    // Remove the record
    params.delete(id);
    // update the index
    params.set(this.name + "list", encodeURIComponent(JSON.stringify(updatedIndex)));

    // Update the URL without refreshing the page
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }
}

const Adapters = {
  'memory': InMemoryStrategy,
  'url': QueryStringStrategy,
  'sessionStorage': SessionStorageStrategy,
  'localStorage': LocalStorageStrategy
};

export default Adapters;
