import indexeddbAdapter from "./indexeddb.mjs";
import { getAppId, generateId, getModels } from "./appstate.mjs";
import P2P from "./rtc-worker.mjs";

function getDefaultCRUDEndpoints(modelName, endpoints = {}) {
  return {
    [`GET /api/${modelName}`]: function () {
      return this.getMany();
    },
    [`GET /api/${modelName}/:id`]: function ({ id }) {
      return this.get(id);
    },
    [`POST /api/${modelName}`]: function (item) {
      return this.add(item);
    },
    [`DELETE /api/${modelName}/:id`]: function ({ id }) {
      return this.remove(id);
    },
    [`PATCH /api/${modelName}/:id`]: function ({ id, ...rest }) {
      return this.edit({ id, ...rest });
    },
    ...endpoints,
  };
}

// Convert the endpoint string to a regular expression.
const endpointToRegex = (endpoint) => {
  const [method, path] = endpoint.split(" ");
  const regexPath = path
    .split("/")
    .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
    .join("/");
  return new RegExp(`^${method} ${regexPath}$`);
};

export let models;
export let api;

export async function initializeApiModel() {
  if (models && api) {
    return { models, api }; // If already initialized, return cached values
  }

  const appId = await getAppId();
  const modelList = await getModels(appId);
  models = defineModels(modelList, appId);
  api = Object.entries(modelList).reduce((acc, [name, model]) => {
    const endpoints = getDefaultCRUDEndpoints(name, model.endpoints);
    Object.entries(endpoints).forEach(([endpoint, callback]) => {
      const regex = endpointToRegex(endpoint);
      acc[String(endpoint)] = {
        regex,
        model: models[name],
        callback,
      };
    });
    return acc;
  }, {});

  return { models, api };
}

let oplog;
let queue;

class ReactiveRecord {
  async init({ importData, ...properties }, name, appId) {
    this.name = name;
    this.adapter = indexeddbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    this.appId = appId;
    this.store = this.adapter.createStore(`${this.appId}_${name}`, "kv");
    // TODO: create one store and reuse it globally
    oplog = this.adapter.createStore(`${this.appId}_oplog`, "kv");
    queue = this.adapter.createStore(`${this.appId}_queue`, "kv");
    if (importData && (await this.adapter.isEmpty(this.store))) {
      this.addMany(importData);
    }
  }

  constructor(properties, name, appId) {
    this.init(properties, name, appId);
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

    return properties.map((prop) => [`${prop}_${id}`, value[prop]]);
  }
  async add(value) {
    const entries = this._generateEntries(value);
    await this._setMany(entries);
    return { ...value, id: this.lastId };
  }

  async addMany(values) {
    const allEntries = [];
    for (const value of values) {
      const entries = this._generateEntries(value);
      allEntries.push(...entries);
    }
    console.log({ allEntries });
    await this._setMany(allEntries);
  }

  async _setMany(entries) {
    for (const [key, value] of entries) {
      this.logOp(key, value);
      P2P.postMessage({
        type: "OPLOG_WRITE",
        store: [this.appId, this.name].join("_"),
        key,
        value,
      });
    }

    return this.adapter.setMany(entries, this.store);
  }

  async _set(key, value) {
    await this._setMany([[key, value]]);
  }

  async edit({ id, ...value }) {
    const entries = Object.keys(value).map((prop) => [
      `${prop}_${id}`,
      value[prop],
    ]);
    await this._setMany(entries);
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
    await this._setMany(allEntries);
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
}

const defineModels = (models, appId) => {
  return Object.fromEntries(
    Object.entries(models).map(([name, module]) => [
      name,
      new ReactiveRecord(module, name, appId),
    ]),
  );
};

export { defineModels };
