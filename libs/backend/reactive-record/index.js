import idbAdapter from "../indexeddb/index.js";
import { generateIdWithUserId, getTimestamp } from "../utils.js";
import { unsetRelation, UpdateRelationship } from "./relationship.js";

const getPrimaryKey = (properties) => Object.keys(properties).find((key) => properties[key]?.primary);

const generateEntries = (modelName, { _userId, id: _id, ...value }) => {
  const appId = ReactiveRecord.appId;
  const primaryKey = getPrimaryKey(ReactiveRecord.models[modelName].properties);
  const newId = _userId ? `${_id}-${_userId}` : _id || generateIdWithUserId(appId, _userId);
  const properties = { ...value, [primaryKey]: value[primaryKey] || "" };

  return { newId, entries: Object.entries(properties).map(([prop, val]) => [prop, newId, val]) };
};

const unsetMany = async (store, keys) => {
  return idbAdapter.remove(keys, store);
};

const setEntries = async (store, properties, entries) => {
  const entriesToAdd = await Promise.all(entries.map(async ([propKey, id, value]) => {
    const key = `${propKey}_${id}`;
    const prop = properties[propKey];
    if (prop?.relationship && ["one", "many"].includes(prop.type)) {
      const relatedModel = ReactiveRecord.models[prop.relationship];
      if (!relatedModel) throw `ERROR: couldn't find model ${prop.relationship}`;
      const { targetForeignKey, type } = prop;
      const prevValue = await getEntry(store, id, { createIfNotFound: true, props: [propKey] });
      if (relatedModel.properties[targetForeignKey]?.targetForeignKey && prevValue) {
        await UpdateRelationship[type]({ prevValue: prevValue[propKey], id, value, relatedModel, targetForeignKey });
      }
    }
    return [key, value];
  }));
  console.log("teste");
  await idbAdapter.set(entriesToAdd, store);
  console.log("teste 4");
  return "423";
};

const removeEntries = async (store, properties, key) => {
  if (!properties.length) return;

  await Promise.all(properties.map(async (propKey) => {
    const prop = properties[propKey];
    if (prop?.relationship) {
      const prevValue = await getEntry(store, key, { props: [propKey] });
      const relatedModel = ReactiveRecord.models[prop.relationship];
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
  await unsetMany(store, keysToDelete);
};

const getEntry = async (store, id, opts = {}) => {
  if (!id) return null;
  const { props, nested = false, createIfNotFound = false } = opts;
  const propNames = props || Object.keys(ReactiveRecord.models[store].properties);
  const keys = propNames.map((prop) => `${prop}_${id}`);
  const values = await idbAdapter.get(keys, store);

  if (!values.some((value) => value != null) && !createIfNotFound) return null;

  const obj = { id };
  await Promise.all(propNames.map(async (propKey, idx) => {
    const prop = ReactiveRecord.models[store].properties[propKey];
    if (!prop) return;

    let value = values[idx];
    if (nested && prop.relationship) {
      const relatedModel = ReactiveRecord.models[prop.relationship];
      if (!relatedModel) return;

      if (prop.type === "one" && value) value = await relatedModel.get(value);
      if (prop.type === "many" && Array.isArray(value)) value = await Promise.all(value.map((id) => relatedModel.get(id)));
    }

    if (prop.metadata && prop.referenceField) {
      const [timestamp, userId] = id.split("-");
      if (prop.metadata === "user" && ReactiveRecord.models.users) value = await ReactiveRecord.models.users.get(userId);
      if (prop.metadata === "timestamp") value = getTimestamp(timestamp, ReactiveRecord.appId);
    }
    obj[propKey] = value ?? prop.defaultValue;
  }));
  return obj;
};

const getEntries = async (store, key, opts = {}) => {
  const { startsWith, props, indexOnly = true, nested = false } = opts;
  const items = await idbAdapter.startsWith(
    startsWith ? `${ReactiveRecord.models[store].referenceKey}_${startsWith}` : key || ReactiveRecord.models[store].referenceKey,
    store,
    { index: indexOnly },
  );
  return indexOnly ? Promise.all(items.map((key) => getEntry(store, key, { props, nested }))) : items;
};

const ReactiveRecord = {
  async add(modelName, value) {
    const { newId, entries } = generateEntries(modelName, value);
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    await setEntries(store, properties, entries);
    console.log("ERROR HERE ?");
    return newId;
  },
  async addMany(modelName, values) {
    const allEntries = values.flatMap((value) => generateEntries(modelName, value).entries);
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    await setEntries(store, properties, allEntries);
  },
  async edit(modelName, { id, ...value }) {
    const entries = Object.entries(value).map(([prop, val]) => [prop, id, val]);
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    await setEntries(store, properties, entries);
    return { id, ...value };
  },
  async editMany(modelName, records) {
    if (!records?.length) return;
    const allEntries = records.flatMap(({ id, ...value }) =>
      Object.entries(value).map(([prop, val]) => [prop, id, val])
    );
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    await setEntries(store, properties, allEntries);
  },
  async get(modelName, id, opts) {
    const store = ReactiveRecord.stores[modelName];
    return getEntry(store, id, opts);
  },
  async getMany(modelName, key, opts) {
    const store = ReactiveRecord.stores[modelName];
    return getEntries(store, key, opts);
  },
  async remove(modelName, key) {
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    return removeEntries(store, properties, key);
  },
  async removeMany(modelName, ids) {
    if (!ids?.length) return;
    const store = ReactiveRecord.stores[modelName];
    const properties = ReactiveRecord.models[modelName].properties;
    await Promise.all(ids.map((id) => removeEntries(store, properties, id)));
  },
  async isEmpty(modelName) {
    const store = ReactiveRecord.stores[modelName];
    return idbAdapter.isEmpty(store);
  },
};

export default ReactiveRecord;
