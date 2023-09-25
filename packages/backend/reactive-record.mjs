import {
  setItem,
  removeItem,
  getItem,
  getMany,
  createStore,
  startsWith,
} from "./indexeddb.mjs";
import { getAppId, generateId } from "./helpers.mjs";

class ReactiveRecord {
  async init(properties, name) {
    this.name = name;
    this.adapter = {
      setItem,
      removeItem,
      getItem,
      getMany,
      createStore,
      startsWith,
    };
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];

    this.appId = await getAppId();
    this.store = this.adapter.createStore(`${this.appId}_${name}`, name);
    this.oplog = this.adapter.createStore(`${this.appId}_${name}_oplog`, name);
  }

  constructor(config, name) {
    this.init(config, name);
  }

  async logOp(key, value = null) {
    const operationId = generateId(this.appId);
    const flattenedKey = `${key}_${operationId}`;
    await this.adapter.setItem(flattenedKey, value, this.oplog);
  }
  async add(value) {
    const id = value?.id || generateId(this.appId);
    const properties = Object.keys(value);
    if (!properties[this.referenceKey]) {
      properties[this.referenceKey] = "";
    }
    await Promise.all(
      properties.map((prop) => this._set(`${prop}_${id}`, value[prop])),
    );

    return { ...value, id };
  }

  async edit({ id, ...value }) {
    const updatedProperties = Object.keys(value);
    await Promise.all(
      updatedProperties.map((prop) => this._set(`${prop}_${id}`, value[prop])),
    );
  }

  async remove(key) {
    const properties = Object.keys(this.properties);
    if (!properties) return;
    await Promise.all(
      properties.map(async (prop) => {
        const propKey = `${prop}_${key}`;
        this.logOp(propKey, "");
        return await this.adapter.removeItem(propKey, this.store);
      }),
    );

    // Record this removal (with an empty value)
  }

  async getOps(sinceTimestamp = 0) {
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
      indexOnly,
    );
    return indexOnly
      ? Promise.all(items.map(async (key) => await this.get(key, props)))
      : Promise.resolve(items);
  }

  async _set(key, value) {
    this.logOp(key, value);
    return this.adapter.setItem(key, value, this.store);
  }

  async addMany(values) {
    if (!values || !values.length) return;
    const ids = values.map(generateId);
    await Promise.all(
      values.map((value, idx) => this.add({ ...value, id: ids[idx] }, true)),
    );
  }

  async editMany(records) {
    if (!records || !records.length) return;
    await Promise.all(records.map((record) => this.edit(record)));
  }
}

const defineModels = (models) => {
  return Object.fromEntries(
    Object.entries(models).map(([name, module]) => [
      name,
      new ReactiveRecord(module, name),
    ]),
  );
};

export { defineModels };
