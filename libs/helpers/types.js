export const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  date: Date,
  array: Array,
  function: Function,
};

const typeHandlers = {
  boolean: (value) => value === "true",
  string: (value) => value,
  array: (value, defaultValue, itemType) => {
    try {
      const parsedArray = JSON.parse(value);
      return parsedArray.map((item) => {
        if (itemType) {
          return Object.entries(item).reduce((obj, [key, value]) => {
            obj[key] = typeHandlers[itemType[key].type](
              value,
              itemType[key].defaultValue,
            );
            return obj;
          }, {});
        }
        return item;
      });
    } catch (error) {
      console.error("Failed to parse array from string:", error);
      return defaultValue;
    }
  },
  number: (value, defaultValue) =>
    isNaN(Number(value)) ? defaultValue : Number(value),
  date: (value) => new Date(value),
  function: (value) => new Function(value), // Caution: security risk!
  object: (value, defaultValue, objectType) => {
    try {
      const parsedObject = JSON.parse(value);
      return Object.entries(parsedObject).reduce((obj, [key, value]) => {
        if (objectType && objectType[key]) {
          obj[key] = typeHandlers[objectType[key].type](
            value,
            objectType[key].defaultValue,
          );
        } else {
          obj[key] = value;
        }
        return obj;
      }, {});
    } catch (error) {
      console.error("Failed to parse object from string:", error);
      return defaultValue;
    }
  },
};

export const stringToType = (value, typeDefinition) => {
  const handler = typeHandlers[typeDefinition.type];
  if (handler) {
    return handler(
      value,
      typeDefinition.defaultValue,
      typeDefinition.itemType || typeDefinition.objectType,
    );
  }
  return value || typeDefinition.defaultValue;
};

export const T = {
  boolean: (options = {}) => ({
    type: TYPE_MAP["boolean"],
    reflect: !options.sync,
    defaultValue: !!options.defaultValue || false,
    ...options,
  }),

  string: (options = {}) => ({
    type: TYPE_MAP["string"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || "",
    enum: options.enum,
    ...options,
  }),

  array: (options = {}) => ({
    type: TYPE_MAP["array"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || [],
    itemType: options.type,
    ...options,
  }),

  number: (options = {}) => ({
    type: TYPE_MAP["number"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  date: (options = {}) => ({
    type: TYPE_MAP["date"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  function: (options = {}) => ({
    type: TYPE_MAP["function"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  object: (options = {}) => ({
    type: TYPE_MAP["object"],
    reflect: !options.sync,
    defaultValue: options.defaultValue || undefined,
    objectType: options.type,
    ...options,
  }),

  one: (relationship, targetForeignKey, options = {}) => ({
    type: "one",
    relationship,
    targetForeignKey: targetForeignKey,
    ...options,
  }),
  many: (relationship, targetForeignKey, options = {}) => ({
    type: "many",
    relationship,
    targetForeignKey: targetForeignKey,
    ...options,
  }),

  created_by: (referenceField, options = {}) => ({
    type: "object",
    metadata: "user",
    referenceField,
    ...options,
  }),
  created_at: (referenceField, options = {}) => ({
    type: "string",
    metadata: "timestamp",
    referenceField,
    ...options,
  }),

  text: (options = {}) => ({
    formType: "text",
    type: T.string(options),
    ...options,
  }),
  datetime: (options = {}) => ({
    formType: "datetime",
    type: T.string(options),
    ...options,
  }),

  time: (options = {}) => ({
    formType: "time",
    type: T.string(options),
    ...options,
  }),

  checkbox: (options = {}) => ({
    formType: "checkbox",
    type: T.boolean(options),
    ...options,
  }),

  radio: (options = {}) => ({
    formType: "radio",
    type: T.boolean(options),
    ...options,
  }),

  toggle: (options = {}) => ({
    formType: "toggle",
    type: T.boolean(options),
    ...options,
  }),

  textarea: (options = {}) => ({
    formType: "textarea",
    type: T.string(options),
    ...options,
  }),

  custom: (customFormType, options) => ({
    customFormType,
    type: T[customFormType](options),
    ...options,
  }),
};

export default T;
