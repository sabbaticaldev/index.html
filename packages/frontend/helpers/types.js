export const TYPE_MAP = {
  boolean: Boolean,
  number: Number,
  string: String,
  object: Object,
  date: Date,
  array: Array,
  function: Function,
};

const parseJSON = (value, defaultValue) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse JSON from string:", error);
    return defaultValue;
  }
};

const typeHandlers = {
  boolean: (value) => value === "true",
  string: (value) => value,
  array: (value, defaultValue, itemType) => {
    const parsedArray = parseJSON(value, defaultValue);
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
  },
  number: (value, defaultValue) =>
    isNaN(Number(value)) ? defaultValue : Number(value),
  date: (value) => new Date(value),
  function: (value) => new Function(value), // Caution: security risk! TODO: refactor
  object: (value, defaultValue, objectType) => {
    const parsedObject = parseJSON(value, defaultValue);
    return Object.entries(parsedObject).reduce((obj, [key, value]) => {
      obj[key] =
        objectType && objectType[key]
          ? typeHandlers[objectType[key].type](
              value,
              objectType[key].defaultValue,
            )
          : value;
      return obj;
    }, {});
  },
};

export const stringToType = (value, typeDefinition) => {
  const handler = typeHandlers[typeDefinition.type];
  return handler
    ? handler(
        value,
        typeDefinition.defaultValue,
        typeDefinition.itemType || typeDefinition.objectType,
      )
    : value || typeDefinition.defaultValue;
};

const createType = (type, options = {}) => ({
  type: TYPE_MAP[type],
  reflect: !options.sync,
  defaultValue: options.defaultValue || undefined,
  ...options,
});

export const T = {
  boolean: (options = {}) =>
    createType("boolean", {
      defaultValue: !!options.defaultValue || false,
      ...options,
    }),
  string: (options = {}) =>
    createType("string", {
      defaultValue: options.defaultValue || "",
      ...options,
    }),
  array: (options = {}) =>
    createType("array", {
      defaultValue: options.defaultValue || [],
      itemType: options.type,
      ...options,
    }),
  number: (options = {}) => createType("number", options),
  date: (options = {}) => createType("date", options),
  function: (options = {}) => createType("function", options),
  object: (options = {}) =>
    createType("object", { objectType: options.type, ...options }),
};

export default T;
