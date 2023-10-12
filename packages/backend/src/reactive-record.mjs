import indexeddbAdapter from "./indexeddb.mjs";
import { generateId, updateIndexPosition, removeIndexItem } from "./string.mjs";
import P2P from "./rtc-worker.mjs";

let oplog;
let queue;
// Update for a 'one' relationship type
async function updateSingleRelationship(
  oldValue,
  value,
  relatedModel,
  id,
  propKey,
  targetForeignKey,
) {
  const targetType = relatedModel.properties[targetForeignKey]?.type;

  if (oldValue?.[propKey] && oldValue[propKey] !== value[propKey]) {
    if (targetType === "many") {
      const oldTarget = await relatedModel.get(oldValue[propKey], [
        targetForeignKey,
      ]);
      if (oldTarget && oldTarget[targetForeignKey]) {
        oldTarget[targetForeignKey] = removeIndexItem(
          oldTarget[targetForeignKey],
          id,
        );
        await relatedModel._setProperty(
          `${targetForeignKey}_${oldValue[propKey]}`,
          oldTarget[targetForeignKey],
        );
      }
    } else {
      await relatedModel._setProperty(
        `${targetForeignKey}_${oldValue[propKey]}`,
        null,
      );
    }
  }

  if (value) {
    if (targetType === "many") {
      const relatedId = value;
      const target = await relatedModel.get(relatedId, [targetForeignKey]);
      const index = target[targetForeignKey];
      if (!index) {
        await relatedModel._setProperty(`${targetForeignKey}_${relatedId}`, id);
      } else if (!new RegExp(`\\b${id}\\b`).test(index)) {
        target[targetForeignKey] = index + "|" + id;
        await relatedModel._setProperty(
          `${targetForeignKey}_${relatedId}`,
          target[targetForeignKey],
        );
      }
    } else {
      await relatedModel._setProperty(`${targetForeignKey}_${value}`, id);
    }
  }
  if (value) {
    let target;
    let relatedId;
    if (Array.isArray(value) && value.length === 2) {
      // The value format is [position, id]
      const [position = 0, newId] = value;
      relatedId = newId;
      target = await relatedModel.get(relatedId, [targetForeignKey]);
      const index = target[targetForeignKey];
      target[targetForeignKey] = updateIndexPosition(index, id, position);
    } else {
      // The value is just the id, handle as usual
      relatedId = value;
      target = await relatedModel.get(relatedId, [targetForeignKey]);
      const index = target[targetForeignKey];
      if (!index) {
        await relatedModel._setProperty(`${targetForeignKey}_${relatedId}`, id);
      } else if (!new RegExp(`\\b${id}\\b`).test(index)) {
        target[targetForeignKey] = index + "|" + id;
      }
    }
    await relatedModel._setProperty(
      `${targetForeignKey}_${relatedId}`,
      target[targetForeignKey],
    );
  }
}

// Update for a 'many' relationship type
async function updateMultipleRelationship(
  oldValue,
  value,
  relatedModel,
  id,
  propKey,
  targetForeignKey,
) {
  if (oldValue && oldValue[propKey] !== value) {
    const oldTarget = await relatedModel.get(oldValue[propKey], [
      targetForeignKey,
    ]);
    if (oldTarget && oldTarget[targetForeignKey]) {
      oldTarget[targetForeignKey] = removeIndexItem(
        oldTarget[targetForeignKey],
        id,
      );
      await relatedModel._setProperty(
        `${targetForeignKey}_${oldValue[propKey]}`,
        oldTarget[targetForeignKey],
      );
    }
  }

  if (value) {
    const relatedId = value;
    const target = await relatedModel.get(relatedId, [targetForeignKey]);
    const index = target[targetForeignKey];
    if (!index) {
      await relatedModel._setProperty(`${targetForeignKey}_${relatedId}`, id);
    } else if (!new RegExp(`\\b${id}\\b`).test(index)) {
      target[targetForeignKey] = index + "|" + id;
      await relatedModel._setProperty(
        `${targetForeignKey}_${relatedId}`,
        target[targetForeignKey],
      );
    }
  }
}

export const models = {};
class ReactiveRecord {
  constructor({ _initialData, ...properties }, name, appId) {
    this.name = name;
    this.models = models;
    this.adapter = indexeddbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    this.appId = appId;
    this.store = this.adapter.createStore(`${this.appId}_${this.name}`, "kv");
    // TODO: create one store and reuse it globally
    oplog = this.adapter.createStore(`${this.appId}_oplog`, "kv");
    queue = this.adapter.createStore(`${this.appId}_queue`, "kv");

    if (_initialData) {
      this.adapter.isEmpty(this.store).then((empty) => {
        if (empty) {
          this.addMany(_initialData);
          P2P.postMessage({
            type: "REQUEST_UPDATE",
            store: [this.appId, this.name].join("_"),
          });
        }
      });
    }
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

  async _setProperty(key, value) {
    return this.adapter.setItem(key, value, this.store);
  }

  async edit({ id, ...value }) {
    const entries = Object.keys(value).map((prop) => [prop, id, value[prop]]);
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

  async _set(entries) {
    const entriesToAdd = [];

    for (const [propKey, id, value] of entries) {
      const key = `${propKey}_${id}`;
      this.logOp(key, value);
      const prop = this.properties[propKey];

      if (prop?.relationship) {
        const relatedModel = this.models[prop.relationship];
        const { targetForeignKey, type } = prop;

        const oldValue = await this.get(id, [propKey]);

        // Choose the update method based on the relationship type
        if (type === "one") {
          await updateSingleRelationship(
            oldValue,
            value,
            relatedModel,
            id,
            propKey,
            targetForeignKey,
          );
        } else if (type === "many") {
          await updateMultipleRelationship(
            oldValue,
            value,
            relatedModel,
            id,
            propKey,
            targetForeignKey,
          );
        }
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

  async get(id, opts = {}) {
    const { props, nested = false } = opts;
    const propNames = props || Object.keys(this.properties);
    if (Array.isArray(props) && props.length === 1) {
      const key = `${props[0]}_${id}`;
      const value = await this.adapter.getItem(key, this.store);
      return { [props[0]]: value };
    }
    const keys = propNames.map((prop) => `${prop}_${id}`);
    const values = await this.adapter.getMany(keys, this.store);
    const obj = { id };

    // Use map to create an array of promises
    const promises = propNames.map(async (propKey, idx) => {
      const prop = this.properties[propKey];
      if (!prop) return;

      let value = values[idx];
      if (nested && prop.relationship) {
        const relatedModel = this.models[prop.relationship];
        if (!relatedModel) return;

        if (prop.type === "one") {
          const relatedId = values[idx];
          if (relatedId) {
            const target = await relatedModel.get(relatedId);
            value = target;
          }
        }

        if (prop.type === "many") {
          const ids = (values[idx] || "").split("|").filter(Boolean);
          if (ids.length > 0) {
            value = await Promise.all(
              ids.map(async (id) => await relatedModel.get(id)),
            );
          }
        }
      }

      obj[propKey] = value || prop.defaultValue;
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    return obj;
  }

  async getMany(key, opts = {}) {
    const { props, indexOnly = true, nested = false } = opts;
    const items = await this.adapter.startsWith(
      key || this.referenceKey,
      this.store,
      { index: indexOnly },
    );
    return indexOnly
      ? Promise.all(
        items.map(async (key) => await this.get(key, { props, nested })),
      )
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
