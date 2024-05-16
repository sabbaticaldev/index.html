export const UpdateRelationship = {
  one: updateOneRelationship,
  many: updateManyRelationship,
};

async function updateOneRelationship(params) {
  const { prevValue, value, relatedModel, id, targetForeignKey } = params;
  const targetType = relatedModel.properties[targetForeignKey]?.type;
  const isMany = targetType === "many";
  const [, prevId] = extractId(prevValue);
  const [position, newId] = extractId(value) || [];

  if (prevId) await unsetRelation(relatedModel, id, prevId, targetForeignKey, isMany);
  if (newId) await setRelation(relatedModel, id, newId, targetForeignKey, isMany, position);
}

async function updateManyRelationship(params) {
  const { prevId, value, relatedModel, id, targetForeignKey } = params;
  const prevIds = ensureArray(prevId);
  const newIds = ensureArray(value);

  const addedIds = newIds.filter((v) => !prevIds.includes(v));
  const removedIds = prevIds.filter((v) => !newIds.includes(v));

  await Promise.all([
    ...addedIds.map((relatedId) => setRelation(relatedModel, id, relatedId, targetForeignKey)),
    ...removedIds.map((relatedId) => unsetRelation(relatedModel, id, relatedId, targetForeignKey)),
  ]);
}

const ensureArray = (value) => (Array.isArray(value) ? value : [value]);
const extractId = (val) => (Array.isArray(val) ? val : [null, val]);

export async function unsetRelation(relatedModel, id, prevId, targetForeignKey, isMany = false) {
  if (!prevId) return;
  const keyToUpdate = `${targetForeignKey}_${prevId}`;
  if (isMany) {
    const prevTarget = await relatedModel.get(prevId, [targetForeignKey]);
    if (prevTarget) {
      const oldIndex = prevTarget[targetForeignKey] || [];
      await relatedModel._setProperty(keyToUpdate, oldIndex.filter((entry) => entry !== id));
    }
  } else {
    await relatedModel._setProperty(keyToUpdate, null);
  }
}

async function setRelation(relatedModel, id, newId, targetForeignKey, isMany = false, position) {
  const target = await relatedModel.get(newId, { createIfNotFound: true, props: [targetForeignKey] });
  let newIndex = target[targetForeignKey] || [];

  if (isMany && Array.isArray(newIndex)) {
    if (typeof position === "number") newIndex.splice(position, 0, id);
    else if (!newIndex.includes(id)) newIndex.push(id);
  } else {
    newIndex = id;
  }
  await relatedModel._setProperty(`${targetForeignKey}_${newId}`, newIndex);
}
