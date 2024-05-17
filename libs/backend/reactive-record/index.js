import idbAdapter from "../indexeddb/index.js";
import { generateIdWithUserId, getTimestamp } from "../utils.js";
import { unsetRelation, UpdateRelationship } from "./relationship.js";

const getPrimaryKey = (properties) => Object.keys(properties).find((key) => properties[key]?.primary);

const generateEntries = (modelName, { _userId, id: _id, ...value }) => {
  const appId = ReactiveRecord.appId;
  const primaryKey = getPrimaryKey(ReactiveRecord.models[modelName]);
  const newId = _userId ? `${_id}-${_userId}` : _id || generateIdWithUserId(appId, _userId);
  const properties = { ...value, [primaryKey]: value[primaryKey] || "" };

  return { newId, entries: Object.entries(properties).map(([prop, val]) => [prop, newId, val]) };
};

const unsetMany = async (store, keys) => {
  return idbAdapter.remove(keys, store);
};

const setEntries = async (modelName, entries) => {  
  const properties = ReactiveRecord.models[modelName];
  const entriesToAdd = await Promise.all(entries.map(async ([propKey, id, value]) => {
    const key = `${propKey}_${id}`;
    const prop = properties[propKey];
    if (prop?.relationship && ["one", "many"].includes(prop.type)) {
      const relatedModel = ReactiveRecord.models[prop.relationship];
      if (!relatedModel) throw `ERROR: couldn't find model ${prop.relationship}`;
      const { targetForeignKey, type } = prop;
      const prevValue = await getEntry(modelName, id, { createIfNotFound: true, props: [propKey] });
      if (relatedModel[targetForeignKey]?.targetForeignKey && prevValue) {
        await UpdateRelationship[type]({ prevValue: prevValue[propKey], id, value, relatedModel, targetForeignKey });
      }
    }
    return [key, value];
  }));
  const store = ReactiveRecord.stores[modelName];
  return idbAdapter.set(entriesToAdd, store);
};

const removeEntries = async (modelName, key) => {
  const properties = ReactiveRecord.models[modelName];
  const propKeys = properties && Object.keys(properties);
  if (!propKeys.length) return;
  await Promise.all(propKeys.map(async (propKey) => {
    const prop = properties[propKey];
    if (prop?.relationship) {
      const prevValue = await getEntry(modelName, key, { props: [propKey] });
      const relatedModel = ReactiveRecord.models[prop.relationship];
      if (!relatedModel) {
        console.error(`ERROR: couldn't find model ${prop.relationship}`);
        return;
      }
      const { targetForeignKey, type } = prop;
      const targetIsMany = relatedModel[targetForeignKey]?.type === "many";
      if (type === "one" && prevValue[propKey]) {
        await unsetRelation(relatedModel, key, prevValue[propKey], targetForeignKey, targetIsMany);
      } else if (type === "many" && Array.isArray(prevValue[propKey])) {
        await Promise.all(prevValue[propKey].map((relatedId) =>
          unsetRelation(relatedModel, relatedId, key, targetForeignKey, targetIsMany)
        ));
      }
    }
  }));

  const keysToDelete = propKeys.map((prop) => `${prop}_${key}`);
  const store = ReactiveRecord.stores[modelName];
  await unsetMany(store, keysToDelete);
};

const getEntry = async (modelName, id, opts = {}) => {
  if (!id) return null;
  const { props, nested = false, createIfNotFound = false } = opts;
  const propNames = props || Object.keys(ReactiveRecord.models[modelName]);
  const store = ReactiveRecord.stores[modelName];
  const keys = propNames.map((prop) => `${prop}_${id}`);
  const values = await idbAdapter.get(keys, store);  
  if (!values.some((value) => value != null) && !createIfNotFound) return null;

  const obj = { id };
  await Promise.all(propNames.map(async (propKey, idx) => {    
    const prop = ReactiveRecord.models[modelName][propKey];
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

const getEntries = async (modelName, key, opts = {}) => {
  const { startsWith, props, indexOnly = false, nested = false } = opts;
  const store = ReactiveRecord.stores[modelName];
  const primaryKey = getPrimaryKey(ReactiveRecord.models[modelName]);
  const items = await idbAdapter.startsWith(
    startsWith ? `${primaryKey}_${startsWith}` : key || primaryKey,
    store,
    { index: indexOnly },
  );
  
  return indexOnly ? items : Promise.all(items.map(({ id }) => getEntry(modelName, id, { props, nested })));
};

const ReactiveRecord = {
  async add(modelName, value) {
    const { newId, entries } = generateEntries(modelName, value);
    await setEntries(modelName, entries);    
    return newId;
  },
  async addMany(modelName, values) {
    const allEntries = values.flatMap((value) => generateEntries(modelName, value).entries);  
    await setEntries(modelName, allEntries);
  },
  async edit(modelName, { id, ...value }) {
    const entries = Object.entries(value).map(([prop, val]) => [prop, id, val]);
    await setEntries(modelName, entries);
    return { id, ...value };
  },
  async editMany(modelName, records) {
    if (!records?.length) return;
    const allEntries = records.flatMap(({ id, ...value }) =>
      Object.entries(value).map(([prop, val]) => [prop, id, val])
    );
    await setEntries(modelName, allEntries);
  },
  async get(modelName, id, opts) {
    return getEntry(modelName, id, opts);
  },
  async getMany(modelName, key, opts) {
    return getEntries(modelName, key, opts);
  },
  async remove(modelName, key) {
    return removeEntries(modelName, key);
  },
  async removeMany(modelName, ids) {
    if (!ids?.length) return;
    await Promise.all(ids.map((id) => removeEntries(modelName, id)));
  },
  async isEmpty(modelName) {
    const store = ReactiveRecord.stores[modelName];
    return idbAdapter.isEmpty(store);
  },
};

export default ReactiveRecord;
