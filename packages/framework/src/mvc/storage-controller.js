const generateId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return Array.from({ length: 5 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

/**
 * @interface
 */
class StorageStrategy {
  constructor(modelName) {
    this.modelName = modelName;
    this.isServer = typeof window === "undefined";
    /** @type {Record<string, any>} */
    this.storage = {};
  }

  /**
   * @param {string} key
   * @returns {any}
   */
  get(id) {
    if (this.isServer) return null;
    const stored = this.storage.getItem(id);
    const value = stored ? JSON.parse(stored) : null;  
    return (!value || Array.isArray(value)) ? value : {...value, id };
  }

  /**
   * @param {string} key
   * @param {any} value
   * @private
   */
  

  _set(key, value) {
    if (this.isServer) return;
    this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  add(value) {
    const id = generateId();
    this._set(this.modelName+id, value);
    const index = this.get(this.modelName+"list") || []; 
    index.push(this.modelName+id);
    this._set(this.modelName+"list", index);
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

  /**
   * @returns {any[]}
   */
  list() {
    if (this.isServer) return [];
    const index = this.get(this.modelName+"list");    
    return Array.isArray(index) ? index.map(key => this.get(key)) : [];
  }


  remove(key) {
    if (this.isServer) return;
    const indexKey = this.modelName + "list";
    const index = this.get(indexKey);
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];    
    this._set(this.modelName+"list", updatedIndex);
    this.storage.removeItem(key);
  }
}

class InMemoryStrategy extends StorageStrategy {
  constructor(modelName) {
    super(modelName);
    this.modelName = modelName;
    /** @type {Record<string, any>} */
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  _set(key, value) {
    this.storage[key] = value;
  }

  remove(key) {
    delete this.storage[key];
  }
}

class LocalStorageStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    /** @type {Record<string, any>} */
    this.storage = localStorage;
  }
}

class SessionStorageStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    /** @type {Record<string, any>} */
    this.storage = sessionStorage;
  }
}

class QueryStringStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    // differently to InMemoryStrategy, here we implement the same API as sessionStorage/localStorage so it reuses the same logic from parent StorageStrategy
    /** @type {Record<string, any>} */
    this.storage = {
      getItem: (key) => {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(key);
        return value ? JSON.parse(decodeURIComponent(value)) : null;
      },
  
      setItem: (key, value) => {
        const params = new URLSearchParams(window.location.search);
        params.set(key, encodeURIComponent(JSON.stringify(value)));
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
      },
      removeItem: (key) => {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
      }
    };
  }
}



const Adapters = {
  "memory": InMemoryStrategy,
  "url": QueryStringStrategy,
  "sessionStorage": SessionStorageStrategy,
  "localStorage": LocalStorageStrategy
};

export default Adapters;