import idbAdapter from "./indexeddb.mjs";
import { generateId, getTimestamp } from "./string.mjs";
import WebWorker from "./web-worker.mjs";

let oplog;
let queue;
const UpdateRelationship = {
  one: async function ({
    prevValue,
    value,
    relatedModel,
    id,
    targetForeignKey,
  }) {
    const targetType = relatedModel.properties[targetForeignKey]?.type;
    const isMany = targetType === "many";

    // Extract the ID from the value and prevValue
    const extractId = (val) => (Array.isArray(val) ? val : [null, val]);
    const [prevPosition, prevId] = extractId(prevValue);
    const [position, newId] = extractId(value);

    if (prevId) {
      let keyToUpdate = `${targetForeignKey}_${prevId}`;

      if (isMany) {
        const prevTarget = await relatedModel.get(prevId, [targetForeignKey]);
        const oldIndex = prevTarget[targetForeignKey] || [];
        console.log(
          { prevId, prevTarget, targetForeignKey },
          oldIndex.filter((entry) => entry !== id),
        );
        if (prevTarget) {
          await relatedModel._setProperty(
            keyToUpdate,
            oldIndex.filter((entry) => entry !== id),
          );
        }
      } else {
        await relatedModel._setProperty(keyToUpdate, null);
      }
    }

    if (newId) {
      const target = await relatedModel.get(newId, [targetForeignKey]);
      if (isMany) {
        let newIndex = target[targetForeignKey] || [];
        if (Array.isArray(value) && !isNaN(position)) {
          newIndex.splice(position, 0, id);
        } else {
          if (!newIndex.includes(id)) {
            newIndex.push(id);
          }
        }
        await relatedModel._setProperty(
          `${targetForeignKey}_${newId}`,
          newIndex,
        );
      } else {
        await relatedModel._setProperty(`${targetForeignKey}_${newId}`, id);
      }
    }
  },

  many: async function ({ prevId, value, relatedModel, id, targetForeignKey }) {
    // If the value is not an array, convert it into one for easier processing.
    const prevIds = Array.isArray(prevId) ? prevId : [prevId];
    const newIds = Array.isArray(value) ? value : [value];

    // Find the ids which are added and the ones which are removed.
    const addedIds = newIds.filter((v) => !prevIds.includes(v));
    const removedIds = prevIds.filter((v) => !newIds.includes(v));

    for (const relatedId of addedIds) {
      const target = await relatedModel.get(relatedId, [targetForeignKey]);
      const targetType = relatedModel.properties[targetForeignKey]?.type;

      if (targetType === "one") {
        await relatedModel._setProperty(`${targetForeignKey}_${relatedId}`, id);
      } else {
        // Handle the "many" case
        let index = target[targetForeignKey] || [];
        if (!index.includes(id)) {
          target[targetForeignKey] = [...index, id];
          await relatedModel._setProperty(
            `${targetForeignKey}_${relatedId}`,
            target[targetForeignKey],
          );
        }
      }
    }

    for (const relatedId of removedIds) {
      const target = await relatedModel.get(relatedId, [targetForeignKey]);
      const targetType = relatedModel.properties[targetForeignKey]?.type;

      if (targetType === "one") {
        await relatedModel._setProperty(
          `${targetForeignKey}_${relatedId}`,
          null,
        );
      } else {
        // Handle the "many" case
        if (target && Array.isArray(target[targetForeignKey])) {
          target[targetForeignKey] = target[targetForeignKey].filter(
            (entry) => entry !== id,
          );
          await relatedModel._setProperty(
            `${targetForeignKey}_${relatedId}`,
            target[targetForeignKey],
          );
        }
      }
    }
  },
};

export const models = {};
class ReactiveRecord {
  constructor(
    { _initialData, ...properties },
    { name, appId, userId, logOperations },
  ) {
    this.name = name;
    this.models = models;
    this.adapter = idbAdapter;
    this.properties = properties;
    this.referenceKey = Object.keys(properties)[0];
    this.appId = appId;
    this.userId = userId;
    this.store = this.adapter.createStore(`${this.appId}_${this.name}`, "kv");

    if (logOperations) {
      // TODO: create one store and reuse it globally
      oplog = this.adapter.createStore(`${this.appId}_oplog`, "kv");
      queue = this.adapter.createStore(`${this.appId}_queue`, "kv");
    }

    if (_initialData) {
      this.adapter.isEmpty(this.store).then((empty) => {
        if (empty) {
          this.addMany(_initialData);
          WebWorker.postMessage({
            type: "REQUEST_UPDATE",
            store: [this.appId, this.name].join("_"),
          });
        }
      });
    }
  }

  async logOp(key, value = null) {
    if (oplog) {
      const operationId = generateId(this.appId, this.userId);
      const propKey = `${this.name}_${key}`;
      await this.adapter.setItem(`${propKey}_${operationId}`, value, oplog);
      await this.adapter.setLastOp(`${propKey}_${operationId}`, value, {
        db: queue,
        propKey,
      });
    }
  }

  _generateEntries({ _userId, id: _id, ...value }) {
    let newId = _userId ? _id + "-" + _userId : _id; // TODO: refactor this, big chances of bug
    if (!_id) newId = generateId(this.appId, _userId || this.userId);

    this.lastId = newId;
    const properties = Object.keys(value);
    if (!properties[this.referenceKey]) {
      properties[this.referenceKey] = "";
    }

    return properties.map((prop) => [prop, newId, value[prop]]);
  }

  async add(value) {
    const entries = this._generateEntries(value);
    await this._set(entries);
    return await this.get(this.lastId, Object.keys(value));
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
    return await this.get(id, Object.keys(value));
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

      if (prop?.relationship && ["one", "many"].includes(prop.type)) {
        const relatedModel = this.models[prop.relationship];
        const { targetForeignKey, type } = prop;
        const prevValue = await this.get(id, [propKey]);
        const relatedProp = relatedModel.properties[targetForeignKey];
        if (relatedProp?.targetForeignKey)
          await UpdateRelationship[type]({
            prevValue: prevValue[propKey],
            id,
            value,
            relatedModel,
            targetForeignKey,
          });
      }

      if (oplog)
        WebWorker.postMessage({
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
    if (!id) return;
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
            value = await relatedModel.get(relatedId);
          }
        }

        if (prop.type === "many") {
          const ids = values[idx] || [];
          if (Array.isArray(ids) && ids.length > 0) {
            value = await Promise.all(
              ids.map(async (id) => await relatedModel.get(id)),
            );
          }
        }
      }

      if (prop.metadata && prop.referenceField) {
        const [timestamp, userId] = id.split("-");
        if (prop.metadata === "user" && this.models.users) {
          value = await this.models.users.get(userId);
        }
        if (prop.metadata === "timestamp") {
          value = getTimestamp(timestamp, this.appId);
        }
      }
      obj[propKey] = value || prop.defaultValue;
    });

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

const defineModels = (files, appId, userId, oplog = false) => {
  Object.entries(files).map(([name, module]) => {
    const model = new ReactiveRecord(module, { name, appId, userId, oplog });
    models[name] = model;
  });
  return models;
};

export { defineModels };
