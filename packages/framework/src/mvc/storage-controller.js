import { set, get, del } from "idb-keyval";

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
  async get(id) {
    if (this.isServer) return null;
    const stored = await this.storage.getItem(id);
    const value = stored ? JSON.parse(stored) : null;
    return (!value || Array.isArray(value)) ? value : {...value, id };
  }

  /**
   * @param {string} key
   * @param {any} value
   * @private
   */
  

  async _set(key, value) {
    if (this.isServer) return;
    return this.storage.setItem(key, JSON.stringify(value));
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  async add(value) {
    const id = this.modelName+generateId();
    this._set(id, { ...(value|| {}), id });
    const index = await this.get(this.modelName+"list") || [];
    this._set(this.modelName+"list", [...(index || []), id]);
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  async edit(key, value) {
    let newValue = value;
    if (typeof value === "object" && value !== null) {
      const record = await this.get(key) || {};      
      newValue = {...record, ...value};
    }
    await this._set(key, newValue);
  }

  /**
   * @returns {any[]}
   */
  async list() {
    if (this.isServer) return [];
    const index = await this.get(this.modelName+"list");    
    return Array.isArray(index) ? Promise.all(index.map(async (key) => await this.get(key))) : [];
  }


  async remove(key) {
    if (this.isServer) return;
    const indexKey = this.modelName + "list";
    const index = await this.get(indexKey);
    const updatedIndex = Array.isArray(index) && index.filter(itemKey => itemKey !== key) || [];    
    await this._set(this.modelName+"list", updatedIndex);
    return this.storage.removeItem(key);
  }
}

class InMemoryStrategy extends StorageStrategy {
  constructor(modelName) {
    super(modelName);
    this.modelName = modelName;
    /** @type {Record<string, any>} */
    this.storage = {
      getItem: async (key) => Promise.resolve(this.storage[key]),
      setItem: async (key, value) => {  
        this.storage[key] = value;
        Promise.resolve(localStorage.setItem(key, value));
      },
      removeItem: async (key) =>  {        
        delete this.storage[key];
        Promise.resolve(localStorage.removeItem(key));
      }
      
    };
  }
}

class LocalStorageStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    /** @type {Record<string, any>} */
    this.storage = {
      getItem: async (key) => Promise.resolve(localStorage.getItem(key)),
      setItem: async (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: async (key) => Promise.resolve(localStorage.removeItem(key)), 
    };
  }
}

class SessionStorageStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    /** @type {Record<string, any>} */
    this.storage = {
      getItem: async (key) => Promise.resolve(sessionStorage.getItem(key)),
      setItem: async (key, value) => Promise.resolve(sessionStorage.setItem(key, value)),
      removeItem: async (key) => Promise.resolve(sessionStorage.removeItem(key)), 
    };
  }
}

class QueryStringStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    // differently to InMemoryStrategy, here we implement the same API as sessionStorage/localStorage so it reuses the same logic from parent StorageStrategy
    /** @type {Record<string, any>} */
    this.storage = {
      getItem: async (key) => {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(key);
        return Promise.resolve(value ? JSON.parse(decodeURIComponent(value)) : null);        
      },
  
      setItem: async (key, value) => {
        const params = new URLSearchParams(window.location.search);
        params.set(key, encodeURIComponent(JSON.stringify(value)));
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
        return Promise.resolve({key});
      },
      removeItem: async (key) => {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
        return Promise.resolve({key});
      }
    };
  }
}


class IndexedDBStrategy extends StorageStrategy {
  constructor(name) {
    super(name);
    this.storage = {
      getItem: async (key) => {
        const value = await get(key);
        return value ? JSON.parse(decodeURIComponent(value)) : null;
      },
  
      setItem: async (key, value) => {
        return set(key, encodeURIComponent(JSON.stringify(value)));
      },
      removeItem: async (key) => {
        return del(key);        
      }
    };
  }
}



const Adapters = {
  "memory": InMemoryStrategy,
  "indexeddb": IndexedDBStrategy,
  "url": QueryStringStrategy,
  "sessionStorage": SessionStorageStrategy,
  "localStorage": LocalStorageStrategy
};

export default Adapters;