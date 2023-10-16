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
