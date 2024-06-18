import idbAdapter from "./indexeddb.js";
import { generateIdWithUserId, getTimestamp } from "./utils.js";

export const UpdateRelationship = {
  one: updateOneRelationship,
  many: updateManyRelationship,
};

async function updateOneRelationship(params) {
  const {
    prevValue,
    value,
    relatedModel,
    relatedModelName,
    id,
    targetForeignKey,
  } = params;
  const targetType = relatedModel[targetForeignKey]?.type;
  const isMany = targetType === "many";
  const [, prevId] = extractId(prevValue);
  const [position, newId] = extractId(value) || [];
  if (prevId)
    await unsetRelation(relatedModelName, id, prevId, targetForeignKey, isMany);
  if (newId)
    await setRelation(
      relatedModelName,
      id,
      newId,
      targetForeignKey,
      isMany,
      position,
    );
}

async function updateManyRelationship(params) {
  const { prevValue, value, relatedModelName, id, targetForeignKey } = params;
  const prevIds = ensureArray(prevValue);
  const newIds = ensureArray(value);

  const addedIds = newIds.filter((v) => !prevIds.includes(v));
  const removedIds = prevIds.filter((v) => !newIds.includes(v));

  await Promise.all([
    ...addedIds.map((relatedId) =>
      setRelation(relatedModelName, id, relatedId, targetForeignKey),
    ),
    ...removedIds.map((relatedId) =>
      unsetRelation(relatedModelName, id, relatedId, targetForeignKey),
    ),
  ]);
}

const ensureArray = (v) => (Array.isArray(v) ? v : [v]).filter((v) => !!v);
const extractId = (v) => (Array.isArray(v) ? v : [null, v]);

export async function unsetRelation(
  relatedModelName,
  id,
  prevId,
  targetForeignKey,
  isMany = false,
) {
  if (!prevId) return;
  if (isMany) {
    const prevTarget = await ReactiveRecord.get(relatedModelName, prevId, {
      props: [targetForeignKey],
    });
    if (prevTarget) {
      const oldIndex = prevTarget[targetForeignKey] || [];
      await ReactiveRecord.edit(
        relatedModelName,
        {
          id: prevId,
          [targetForeignKey]: oldIndex.filter((entry) => entry !== id),
        },
        { skipRelationship: true },
      );
    }
  } else {
    await ReactiveRecord.edit(
      relatedModelName,
      { id: prevId, [targetForeignKey]: null },
      { skipRelationship: true },
    );
  }
}

async function setRelation(
  relatedModelName,
  id,
  newId,
  targetForeignKey,
  isMany = false,
  position,
) {
  const target = await ReactiveRecord.get(relatedModelName, newId, {
    createIfNotFound: true,
    props: [targetForeignKey],
  });
  let newIndex = target[targetForeignKey] || [];

  if (isMany && Array.isArray(newIndex)) {
    if (typeof position === "number") newIndex.splice(position, 0, id);
    else if (!newIndex.includes(id)) newIndex.push(id);
  } else {
    newIndex = id;
  }
  await ReactiveRecord.edit(
    relatedModelName,
    { id: newId, [targetForeignKey]: newIndex },
    { skipRelationship: true },
  );
}

const getPrimaryKey = (properties) => {
  const props = Object.keys(properties);
  return props.find((key) => properties[key]?.primary) || props[0];
};

const generateEntries = (modelName, { _userId, id: _id, ...value }) => {
  const appId = ReactiveRecord.appId;
  const primaryKey = getPrimaryKey(ReactiveRecord.models[modelName]);
  const newId = _userId
    ? `${_id}-${_userId}`
    : _id || generateIdWithUserId(appId, _userId);
  const properties = { ...value, [primaryKey]: value[primaryKey] || "" };

  return {
    newId,
    entries: Object.entries(properties).map(([prop, val]) => [
      prop,
      newId,
      val,
    ]),
  };
};

const unsetMany = async (store, keys) => {
  return idbAdapter.remove(keys, store);
};

const setEntries = async (modelName, entries = [], opts = {}) => {
  const { skipRelationship } = opts;
  const properties = ReactiveRecord.models[modelName];
  const entriesToAdd = await Promise.all(
    entries.map(async ([propKey, id, value]) => {
      const key = `${propKey}_${id}`;
      const prop = properties[propKey];
      if (
        !skipRelationship &&
        prop?.relationship &&
        ["one", "many"].includes(prop.type)
      ) {
        const relatedModel = ReactiveRecord.models[prop.relationship];
        if (!relatedModel)
          throw `ERROR: couldn't find model ${prop.relationship}`;
        const { targetForeignKey, type } = prop;
        const prevValue = await getEntry(modelName, id, { props: [propKey] });
        if (relatedModel[targetForeignKey]) {
          await UpdateRelationship[type]({
            prevValue: prevValue?.[propKey],
            value,
            id,
            relatedModel,
            relatedModelName: prop.relationship,
            targetForeignKey,
          });
        }
      }
      return [key, value];
    }),
  );
  const store = ReactiveRecord.stores[modelName];
  return idbAdapter.set(entriesToAdd, store);
};

const removeEntries = async (modelName, key) => {
  const properties = ReactiveRecord.models[modelName];
  const propKeys = properties && Object.keys(properties);
  if (!propKeys.length) return;
  await Promise.all(
    propKeys.map(async (propKey) => {
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
          await unsetRelation(
            prop.relationship,
            key,
            prevValue[propKey],
            targetForeignKey,
            targetIsMany,
          );
        } else if (type === "many" && Array.isArray(prevValue[propKey])) {
          await Promise.all(
            prevValue[propKey].map((relatedId) =>
              unsetRelation(
                prop.relationship,
                relatedId,
                key,
                targetForeignKey,
                targetIsMany,
              ),
            ),
          );
        }
      }
    }),
  );

  const keysToDelete = propKeys.map((prop) => `${prop}_${key}`);
  const store = ReactiveRecord.stores[modelName];
  await unsetMany(store, keysToDelete);
};

const getEntry = async (modelName, id, opts = {}) => {
  if (!id) return null;
  const { props, nested = false, createIfNotFound = false } = opts;
  const propNames = props || Object.keys(ReactiveRecord.models[modelName]);
  const store = ReactiveRecord.stores[modelName];
  const primaryKey = getPrimaryKey(ReactiveRecord.models[modelName]);
  const keys = [...new Set(propNames.concat(primaryKey))].map(
    (prop) => `${prop}_${id}`,
  );
  const values = await idbAdapter.get(keys, store);
  const entryExists = values.some((value) => value != null);

  if (!entryExists && !createIfNotFound) return null;

  const obj = { id };
  await Promise.all(
    propNames.map(async (propKey, idx) => {
      const prop = ReactiveRecord.models[modelName][propKey];
      if (!prop) return;

      let value = values[idx];

      if (nested && prop.relationship) {
        if (prop.type === "one" && value)
          value = await ReactiveRecord.get(prop.relationship, value);
        if (prop.type === "many" && Array.isArray(value))
          value = await Promise.all(
            value.map((relatedId) =>
              ReactiveRecord.get(prop.relationship, relatedId),
            ),
          );
      }

      if (prop.metadata && prop.referenceField) {
        const [timestamp, userId] = id.split("-");
        if (prop.metadata === "user" && ReactiveRecord.models.users)
          value = await ReactiveRecord.get("users", userId);
        if (prop.metadata === "timestamp")
          value = getTimestamp(timestamp, ReactiveRecord.appId);
      }

      obj[propKey] = value ?? prop.defaultValue;
    }),
  );

  if (!entryExists && createIfNotFound) {
    await ReactiveRecord.add(modelName, obj, { skipRelationship: true });
  }
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

  return indexOnly
    ? items
    : Promise.all(
        items.map(({ id }) => getEntry(modelName, id, { props, nested })),
      );
};

const ReactiveRecord = {
  async add(modelName, record, opts = {}) {
    const { newId, entries } = generateEntries(modelName, record);
    await setEntries(modelName, entries, opts);
    return newId;
  },
  async addMany(modelName, values = []) {
    const allEntries = values.flatMap(
      (value) => generateEntries(modelName, value).entries,
    );
    await setEntries(modelName, allEntries);
  },
  async edit(modelName, { id, ...value }, opts = {}) {
    const entries = Object.entries(value).map(([prop, val]) => [prop, id, val]);
    await setEntries(modelName, entries, opts);
    return { id, ...value };
  },
  async editMany(modelName, records, opts = {}) {
    if (!records?.length) return;
    const allEntries = records.flatMap(({ id, ...value }) =>
      Object.entries(value).map(([prop, val]) => [prop, id, val]),
    );
    await setEntries(modelName, allEntries, opts);
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
