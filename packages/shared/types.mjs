export const T = {
  boolean: (options = {}) => ({
    type: "boolean",
    defaultValue: options.defaultValue ?? false,
    ...options,
  }),

  string: (options = {}) => ({
    type: "string",
    defaultValue: options.defaultValue || "",
    enum: options.enum || [],
    ...options,
  }),

  array: (options = {}) => ({
    type: "array",
    defaultValue: options.defaultValue || [],
    enum: options.enum || [],
    ...options,
  }),

  number: (options = {}) => ({
    type: "number",
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  date: (options = {}) => ({
    type: "date",
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  function: (options = {}) => ({
    type: "function",
    defaultValue: options.defaultValue || undefined,
    ...options,
  }),

  object: (options = {}) => ({
    type: "object",
    defaultValue: options.defaultValue || undefined,
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
  text: (options = {}) => ({
    formType: "text",
    type: T.string(options),
  }),
  datetime: (options = {}) => ({
    formType: "datetime",
    type: T.string(options),
  }),

  time: (options = {}) => ({
    formType: "time",
    type: T.string(options),
  }),

  checkbox: (options = {}) => ({
    formType: "checkbox",
    type: T.boolean(options),
  }),

  radio: (options = {}) => ({
    formType: "radio",
    type: T.boolean(options),
  }),

  toggle: (options = {}) => ({
    formType: "toggle",
    type: T.boolean(options),
  }),

  richText: (options = {}) => ({
    formType: "richText",
    type: T.string(options),
  }),

  custom: (customFormType, options) => ({
    customFormType,
    type: T[customFormType](options),
  }),
};
