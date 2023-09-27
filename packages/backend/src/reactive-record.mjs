import indexeddbAdapter from "./indexeddb.mjs";
import { getAppId, generateId } from "./helpers.mjs";

let oplog;
let queue;

class ReactiveRecord {
  async init(properties, name) {
    this.name = name;
    this.adapter = indexeddbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];

    this.appId = await getAppId();
    this.store = this.adapter.createStore(`${this.appId}_${name}`, "kv");
    // TODO: create one store and reuse it globally
    oplog = this.adapter.createStore(`${this.appId}_oplog`, "kv");
    queue = this.adapter.createStore(`${this.appId}_queue`, "kv");
  }

  constructor(config, name) {
    this.init(config, name);
  }

  async logOp(key, value = null) {
    if (oplog) {
      const operationId = generateId(this.appId);
      const propKey = `${this.name}_${key}`;
      await this.adapter.setItem(`${propKey}_${operationId}`, value, {
        store: oplog,
      });
      await this.adapter.setLastOp(`${propKey}_${operationId}`, value, {
        store: queue,
        propKey,
      });
    }
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
        return await this.adapter.removeItem(propKey, { store: this.store });
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
      { index: indexOnly },
    );
    return indexOnly
      ? Promise.all(items.map(async (key) => await this.get(key, props)))
      : Promise.resolve(items);
  }

  async _set(key, value) {
    this.logOp(key, value);
    // P2P.postMessage({
    //   type: "OPLOG_WRITE",
    //   store: [this.appId, this.name].join("_"),
    //   key,
    //   value,
    // });
    return this.adapter.setItem(key, value, { store: this.store });
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
