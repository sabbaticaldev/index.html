import indexeddbAdapter from "./indexeddb.mjs";
import { generateId } from "./string.mjs";
import P2P from "./rtc-worker.mjs";

let oplog;
let queue;
export const models = {};
class ReactiveRecord {
  async init(initialData) {
    this.store = this.adapter.createStore(`${this.appId}_${this.name}`, "kv");
    // TODO: create one store and reuse it globally
    oplog = this.adapter.createStore(`${this.appId}_oplog`, "kv");
    queue = this.adapter.createStore(`${this.appId}_queue`, "kv");
    if (initialData && (await this.adapter.isEmpty(this.store))) {
      this.addMany(initialData);
    }
  }

  constructor({ _initialData, ...properties }, name, appId) {
    console.log({ _initialData, properties, name, appId });
    this.name = name;
    this.models = models;
    this.adapter = indexeddbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    this.appId = appId;
    this.init(_initialData);
  }

  async logOp(key, value = null) {
    if (oplog) {
      const operationId = generateId(this.appId);
      const propKey = `${this.name}_${key}`;
      await this.adapter.setItem(`${propKey}_${operationId}`, value, oplog);
      await this.adapter.setLastOp(`${propKey}_${operationId}`, value, {
        db: queue,
        propKey,
      });
    }
  }

  _generateEntries(value) {
    let id = value?.id ? value.id : generateId(this.appId, this.lastId);
    this.lastId = id;
    const properties = Object.keys(value);
    if (!properties[this.referenceKey]) {
      properties[this.referenceKey] = "";
    }

    return properties.map((prop) => [prop, id, value[prop]]);
  }
  async add(value) {
    const entries = this._generateEntries(value);
    await this._set(entries);
    return { ...value, id: this.lastId };
  }

  async addMany(values) {
    const allEntries = [];
    for (const value of values) {
      const entries = this._generateEntries(value);
      allEntries.push(...entries);
    }
    await this._set(allEntries);
  }

  async _set(entries) {
    const entriesToAdd = [];
    for (const [prop, id, value] of entries) {
      const key = `${prop}_${id}`;
      this.logOp(key, value);
      if (this.properties[prop]?.relationship === prop) {
        console.log(this.properties[prop], this.models);
      }
      P2P.postMessage({
        type: "OPLOG_WRITE",
        store: [this.appId, this.name].join("_"),
        key,
        value,
      });
      entriesToAdd.push([key, value]);
    }
    return this.adapter.setMany(entriesToAdd, this.store);
  }

  async edit({ id, ...value }) {
    const entries = Object.keys(value).map((prop) => [
      `${prop}_${id}`,
      value[prop],
    ]);
    await this._set(entries);
  }

  async editMany(records) {
    if (!records || !records.length) return;
    const allEntries = [];
    for (const record of records) {
      const { id, ...value } = record;
      const entries = Object.keys(value).map((prop) => [
        `${prop}_${id}`,
        value[prop],
      ]);
      allEntries.push(...entries);
    }
    await this._set(allEntries);
  }

  async _unsetMany(keys) {
    for (const key of keys) {
      this.logOp(key, "");
    }
    return this.adapter.removeMany(keys, this.store);
  }

  async remove(key) {
    const properties = Object.keys(this.properties);
    if (!properties) return;
    const keysToDelete = properties.map((prop) => `${prop}_${key}`);
    await this._unsetMany(keysToDelete);
  }

  async removeMany(ids) {
    if (!ids || !ids.length) return;
    const allKeysToDelete = [];
    for (const id of ids) {
      const keysToDelete = Object.keys(this.properties).map(
        (prop) => `${prop}_${id}`,
      );
      allKeysToDelete.push(...keysToDelete);
    }
    await this._unsetMany(allKeysToDelete);
  }

  async getOps() {
    //sinceTimestamp = 0
    // This method fetches all operations after a given timestamp.
    // Can be optimized further based on how oplog is structured.
    const allOperations = await this.adapter.getMany([], this.oplog);
    return allOperations; // Filtering removed, as the flattened approach doesn't have timestamps. Can be re-added if needed.
  }

  async get(id, selectedProps) {
    const propNames = selectedProps || Object.keys(this.properties);
    const keys = propNames.map((prop) => `${prop}_${id}`);
    const values = await this.adapter.getMany(keys, this.store);
    const obj = { id };
    propNames.forEach((prop, idx) => {
      obj[prop] = values[idx] || this.properties[prop]?.defaultValue;
    });
    return obj;
  }

  async getMany(key, props, indexOnly = true) {
    const items = await this.adapter.startsWith(
      key || this.referenceKey,
      this.store,
      { index: indexOnly },
    );
    return indexOnly
      ? Promise.all(items.map(async (key) => await this.get(key, props)))
      : Promise.resolve(items);
  }

  async setItem(key, value) {
    return this.adapter.setItem(key, value, this.store);
  }

  async getItem(key) {
    return this.adapter.getItem(key, this.store);
  }

  async removeItem(key) {
    return this.adapter.removeItem(key, this.store);
  }
}

const defineModels = (files, appId) => {
  Object.entries(files).map(([name, module]) => {
    const model = new ReactiveRecord(module, name, appId);
    models[name] = model;
  });
  return models;
};

export { defineModels };
