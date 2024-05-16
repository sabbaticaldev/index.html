import { generateId, getTimestamp } from "../utils.js";
import { unsetRelation, UpdateRelationship } from "./relationship.js";

export class CrudReactiveRecord {
  _generateEntries({ _userId, id: _id, ...value }) {
    const newId = _userId ? `${_id}-${_userId}` : _id || generateId(this.appId, _userId || this.userId);
    this.lastId = newId;
    const properties = { ...value, [this.referenceKey]: value[this.referenceKey] || "" };

    return Object.entries(properties).map(([prop, val]) => [prop, newId, val]);
  }

  async _setProperty(key, value) {
    return this.adapter.set([[key, value]], this.store);
  }

  async _unsetMany(keys) {
    keys.forEach((key) => this.logOp(key, ""));
    return this.adapter.remove(keys, this.store);
  }

  async _set(entries) {
    const entriesToAdd = [];
    for (const [propKey, id, value] of entries) {
      const key = `${propKey}_${id}`;
      const prop = this.properties[propKey];
      if (prop?.relationship && ["one", "many"].includes(prop.type)) {
        const relatedModel = this.models[prop.relationship];
        if (!relatedModel) throw `ERROR: couldn't find model ${prop.relationship}`;
        const { targetForeignKey, type } = prop;
        const prevValue = await this.get(id, { createIfNotFound: true, props: [propKey] });
        if (relatedModel.properties[targetForeignKey]?.targetForeignKey && prevValue) {
          await UpdateRelationship[type]({ prevValue: prevValue[propKey], id, value, relatedModel, targetForeignKey });
        }
      }
      entriesToAdd.push([key, value]);
    }
    return this.adapter.set(entriesToAdd, this.store);
  }

  async remove(key) {
    const properties = Object.keys(this.properties);
    if (!properties.length) return;

    await Promise.all(properties.map(async (propKey) => {
      const prop = this.properties[propKey];
      if (prop?.relationship) {
        const prevValue = await this.get(key, [propKey]);
        const relatedModel = this.models[prop.relationship];
        if (!relatedModel) {
          console.error(`ERROR: couldn't find model ${prop.relationship}`);
          return;
        }
        const { targetForeignKey, type } = prop;
        const targetIsMany = relatedModel.properties[targetForeignKey]?.type === "many";
        if (type === "one" && prevValue[propKey]) {
          await unsetRelation(relatedModel, key, prevValue[propKey], targetForeignKey, targetIsMany);
        } else if (type === "many" && Array.isArray(prevValue[propKey])) {
          await Promise.all(prevValue[propKey].map((relatedId) =>
            unsetRelation(relatedModel, relatedId, key, targetForeignKey, targetIsMany)
          ));
        }
      }
    }));

    const keysToDelete = properties.map((prop) => `${prop}_${key}`);
    await this._unsetMany(keysToDelete);
  }

  async removeMany(ids) {
    if (!ids?.length) return;
    await Promise.all(ids.map((id) => this.remove(id)));
  }

  async add(value) {
    const entries = this._generateEntries(value);
    await this._set(entries);
    return this.get(this.lastId);
  }

  async addMany(values) {
    const allEntries = values.flatMap(this._generateEntries.bind(this));
    await this._set(allEntries);
  }

  async edit({ id, ...value }) {
    const entries = Object.entries(value).map(([prop, val]) => [prop, id, val]);
    await this._set(entries);
    return { id, ...value };
  }

  async editMany(records) {
    if (!records?.length) return;
    const allEntries = records.flatMap(({ id, ...value }) =>
      Object.entries(value).map(([prop, val]) => [prop, id, val])
    );
    await this._set(allEntries);
  }

  async get(id, opts = {}) {
    if (!id) return null;
    const { props, nested = false, createIfNotFound = false } = opts;
    const propNames = props || Object.keys(this.properties);
    const keys = propNames.map((prop) => `${prop}_${id}`);
    const values = await this.adapter.get(keys, this.store);

    if (!values.some((value) => value != null) && !createIfNotFound) return null;

    const obj = { id };
    await Promise.all(propNames.map(async (propKey, idx) => {
      const prop = this.properties[propKey];
      if (!prop) return;

      let value = values[idx];
      if (nested && prop.relationship) {
        const relatedModel = this.models[prop.relationship];
        if (!relatedModel) return;

        if (prop.type === "one" && value) value = await relatedModel.get(value);
        if (prop.type === "many" && Array.isArray(value)) value = await Promise.all(value.map((id) => relatedModel.get(id)));
      }

      if (prop.metadata && prop.referenceField) {
        const [timestamp, userId] = id.split("-");
        if (prop.metadata === "user" && this.models.users) value = await this.models.users.get(userId);
        if (prop.metadata === "timestamp") value = getTimestamp(timestamp, this.appId);
      }
      obj[propKey] = value ?? prop.defaultValue;
    }));
    return obj;
  }

  async getMany(key, opts = {}) {
    const { startsWith, props, indexOnly = true, nested = false } = opts;
    const items = await this.adapter.startsWith(
      startsWith ? `${this.referenceKey}_${startsWith}` : key || this.referenceKey,
      this.store,
      { index: indexOnly },
    );
    return indexOnly ? Promise.all(items.map((key) => this.get(key, { props, nested }))) : items;
  }
}
