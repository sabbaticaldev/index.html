import idbAdapter from "../indexeddb/index.js";
import { generateId, getTimestamp } from "../utils.js";
import { unsetRelation, UpdateRelationship } from "./relationship.js";

const generateEntries = (appId, referenceKey, { _userId, id: _id, ...value }) => {
  const newId = _userId ? `${_id}-${_userId}` : _id || generateId(appId, _userId);
  const properties = { ...value, [referenceKey]: value[referenceKey] || "" };

  return { newId, entries: Object.entries(properties).map(([prop, val]) => [prop, newId, val]) };
};

const unsetMany = async (adapter, store, keys) => {
  return adapter.remove(keys, store);
};

const setEntries = async (adapter, store, models, properties, entries) => {
  const entriesToAdd = await Promise.all(entries.map(async ([propKey, id, value]) => {
    const key = `${propKey}_${id}`;
    const prop = properties[propKey];
    if (prop?.relationship && ["one", "many"].includes(prop.type)) {
      const relatedModel = models[prop.relationship];
      if (!relatedModel) throw `ERROR: couldn't find model ${prop.relationship}`;
      const { targetForeignKey, type } = prop;
      const prevValue = await getEntry(adapter, store, models, id, { createIfNotFound: true, props: [propKey] });
      if (relatedModel.properties[targetForeignKey]?.targetForeignKey && prevValue) {
        await UpdateRelationship[type]({ prevValue: prevValue[propKey], id, value, relatedModel, targetForeignKey });
      }
    }
    return [key, value];
  }));
  return adapter.set(entriesToAdd, store);
};

const removeEntries = async (adapter, store, models, properties, key) => {
  if (!properties.length) return;

  await Promise.all(properties.map(async (propKey) => {
    const prop = properties[propKey];
    if (prop?.relationship) {
      const prevValue = await getEntry(adapter, store, models, key, { props: [propKey] });
      const relatedModel = models[prop.relationship];
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
  await unsetMany(adapter, store, keysToDelete);
};

const getEntry = async (adapter, store, models, id, opts = {}) => {
  if (!id) return null;
  const { props, nested = false, createIfNotFound = false } = opts;
  const propNames = props || Object.keys(models.properties);
  const keys = propNames.map((prop) => `${prop}_${id}`);
  const values = await adapter.get(keys, store);

  if (!values.some((value) => value != null) && !createIfNotFound) return null;

  const obj = { id };
  await Promise.all(propNames.map(async (propKey, idx) => {
    const prop = models.properties[propKey];
    if (!prop) return;

    let value = values[idx];
    if (nested && prop.relationship) {
      const relatedModel = models[prop.relationship];
      if (!relatedModel) return;

      if (prop.type === "one" && value) value = await relatedModel.get(value);
      if (prop.type === "many" && Array.isArray(value)) value = await Promise.all(value.map((id) => relatedModel.get(id)));
    }

    if (prop.metadata && prop.referenceField) {
      const [timestamp, userId] = id.split("-");
      if (prop.metadata === "user" && models.users) value = await models.users.get(userId);
      if (prop.metadata === "timestamp") value = getTimestamp(timestamp, models.appId);
    }
    obj[propKey] = value ?? prop.defaultValue;
  }));
  return obj;
};

const getEntries = async (adapter, store, models, key, opts = {}) => {
  const { startsWith, props, indexOnly = true, nested = false } = opts;
  const items = await adapter.startsWith(
    startsWith ? `${models.referenceKey}_${startsWith}` : key || models.referenceKey,
    store,
    { index: indexOnly },
  );
  return indexOnly ? Promise.all(items.map((key) => getEntry(adapter, store, models, key, { props, nested }))) : items;
};

const ReactiveRecord = {
  async add(modelName, value, models) {
    const { newId, entries } = generateEntries(models[modelName].appId, models[modelName].referenceKey, value);
    await setEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, entries);
    return getEntry(idbAdapter, models[modelName].store, models, newId);
  },
  async addMany(modelName, values, models) {
    const allEntries = values.flatMap((value) => generateEntries(models[modelName].appId, models[modelName].referenceKey, value).entries);
    await setEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, allEntries);
  },
  async edit(modelName, { id, ...value }, models) {
    const entries = Object.entries(value).map(([prop, val]) => [prop, id, val]);
    await setEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, entries);
    return { id, ...value };
  },
  async editMany(modelName, records, models) {
    if (!records?.length) return;
    const allEntries = records.flatMap(({ id, ...value }) =>
      Object.entries(value).map(([prop, val]) => [prop, id, val])
    );
    await setEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, allEntries);
  },
  async get(modelName, id, opts, models) {
    return getEntry(idbAdapter, models[modelName].store, models, id, opts);
  },
  async getMany(modelName, key, opts, models) {
    return getEntries(idbAdapter, models[modelName].store, models, key, opts);
  },
  async remove(modelName, key, models) {
    return removeEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, key);
  },
  async removeMany(modelName, ids, models) {
    if (!ids?.length) return;
    await Promise.all(ids.map((id) => removeEntries(idbAdapter, models[modelName].store, models, models[modelName].properties, id)));
  },
  async isEmpty(modelName, models) {
    return idbAdapter.isEmpty(models[modelName].store);
  },
};

export default ReactiveRecord;
