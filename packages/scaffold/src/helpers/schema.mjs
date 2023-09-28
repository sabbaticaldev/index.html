function createBaseSchema(dsl) {
  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": `https://bootstrapp.ai/${dsl.name}.schema.json`,
    "title": dsl.name.charAt(0).toUpperCase() + dsl.name.slice(1),
    "type": "object",
    "properties": {},
    "required": dsl.required || [],
    "additionalProperties": dsl.additionalProperties !== undefined ? dsl.additionalProperties : true
  };
}
  
    
  
// Type handlers
const typeHandlers = {
  "string": (descriptor) => {
    const schema = { type: "string" };
    if (descriptor.minLength) schema.minLength = descriptor.minLength;
    if (descriptor.maxLength) schema.maxLength = descriptor.maxLength;
    if (descriptor.pattern) schema.pattern = descriptor.pattern;
    return schema;
  },
  "email": (descriptor) => {
    const schema = { type: "string", format: "email" }; 
    // format: "email" is a common way to describe email in JSON schema. 
    // Some validators will pick this up and validate the format accordingly.
    if (descriptor.minLength) schema.minLength = descriptor.minLength;
    if (descriptor.maxLength) schema.maxLength = descriptor.maxLength;
    // You can add the regex for email here:
    schema.pattern = descriptor.pattern || "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    return schema;
  },
  "number": (descriptor) => {
    const schema = { type: "number" };
    if (descriptor.minimum !== undefined) schema.minimum = descriptor.minimum;
    if (descriptor.maximum !== undefined) schema.maximum = descriptor.maximum;
    return schema;
  },
  "array": (descriptor) => {
    const schema = { type: "array" };
    if (descriptor.items) schema.items = typeToSchema(descriptor.items);
    if (descriptor.minItems) schema.minItems = descriptor.minItems;
    if (descriptor.maxItems) schema.maxItems = descriptor.maxItems;
    return schema;
  },
  "object": (descriptor) => {
    const schema = { type: "object" };
    if (descriptor.properties) {
      schema.properties = propertiesToSchema(descriptor.properties).properties;
    }
    return schema;
  },
  "boolean": () => {
    return { type: "boolean" };
  },
  "timestamp": (descriptor) => {
    const schema = { type: "integer" };  // Using integer for Unix timestamp
    
    if (descriptor.defaultCurrentTimestamp) {
      schema.default = Math.floor(Date.now() / 1000);  // Unix timestamp in seconds
    }
    
    if (descriptor.readOnly) {
      schema.readOnly = true;
    }
    
    // For "before" and "after", you can convert ISO date strings to Unix timestamps
    if (descriptor.before) {
      schema.before = Math.floor(new Date(descriptor.before).getTime() / 1000);
    }
    
    if (descriptor.after) {
      schema.after = Math.floor(new Date(descriptor.after).getTime() / 1000);
    }
    
    return schema;
  }
};
  
function propertiesToSchema(properties) {
  const schema = createBaseSchema({ name: "temp" });
  properties.forEach(property => {
    const [key, descriptor] = Object.entries(property)[0];
    schema.properties[key] = typeToSchema(descriptor);
    if (descriptor.description) {
      schema.properties[key].description = descriptor.description;
    }
    if (descriptor.defaultValue) {
      schema.properties[key].default = descriptor.defaultValue;
    }
  });
  return schema;
}
  
function transformToJSONSchema(dsl) {
  const baseSchema = createBaseSchema(dsl);
  const propertiesSchema = propertiesToSchema(dsl.properties);
  baseSchema.properties = propertiesSchema.properties;
  return baseSchema;
}
  
const initializers = {
  "string": () => "",
  "email": () => "",
  "number": () => 0,
  "array": () => [],
  "object": (descriptor, dslFunction) => descriptor.properties ? dslFunction({ properties: descriptor.properties }) : {},
  "boolean": () => false,
  "timestamp": (descriptor) => descriptor.defaultCurrentTimestamp ? Math.floor(Date.now() / 1000) : null
};

function validateProperty(descriptor, key, value) {
  let errors = [];

  if (descriptor.enum && !descriptor.enum.includes(value)) {
    errors.push(`should be one of [${descriptor.enum.join(", ")}]`);
  }


  // Custom validators
  if (descriptor.custom) {
    const validationResult = descriptor.custom(value);
    if (typeof validationResult === "string") {
      errors.push(validationResult);
    }
  }
    
  switch (descriptor.type) {
  case "string":
  case "email":
    if (typeof value !== "string") {
      errors.push({ field: key, error: "should be a string." });
      break;
    }
    if (descriptor.minLength && value.length < descriptor.minLength) {
      errors.push({ field: key, error: `should have a minimum length of ${descriptor.minLength}.` });
    }
    if (descriptor.maxLength && value.length > descriptor.maxLength) {
      errors.push({ field: key, error: `should have a maximum length of ${descriptor.maxLength}.` });
    }
    if (descriptor.pattern && !new RegExp(descriptor.pattern).test(value)) {
      errors.push({ field: key, error: "does not match the expected pattern." });
    }
    break;
  
  case "number":
    if (typeof value !== "number") {
      errors.push({ field: key, error: "should be a number." });
      break;
    }
    if (descriptor.minimum !== undefined && value < descriptor.minimum) {
      errors.push({ field: key, error: `should be greater than or equal to ${descriptor.minimum}.` });
    }
    if (descriptor.maximum !== undefined && value > descriptor.maximum) {
      errors.push({ field: key, error: `should be less than or equal to ${descriptor.maximum}.` });
    }
    break;
  case "object":
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      errors.push("should be an object.");
    } else {
      // Recursive validation for nested objects
      const nestedErrors = validateEntity(descriptor, value);
      errors = errors.concat(nestedErrors);
    }
    break;
  case "array":
    if (!Array.isArray(value)) {
      errors.push("should be an array.");
    } else if (descriptor.items) {
      // Validate every item in the array
      value.forEach((item, index) => {
        const itemErrors = validateProperty(descriptor.items, item);
        errors = errors.concat(itemErrors.map(err => `Item ${index} ${err}`));
      });
    }
    break;
        // ... other cases
  }

  return errors;
}

function validateEntity(dsl, entity) {
  const errors = [];
  
  // 1. Validate defined properties
  dsl.properties.forEach(property => {
    const [key, descriptor] = Object.entries(property)[0];
  
    // If the field is not present and it's a default, set it
    if (entity[key] === undefined && descriptor.default !== undefined) {
      entity[key] = descriptor.default;
    }
  
    // Only validate if the field is present in the entity or is required
    if (Object.prototype.hasOwnProperty.call(entity, key) || (dsl.required && dsl.required.includes(key))) {    
      const propertyErrors = validateProperty(descriptor, key, entity[key]);
      errors.push(...propertyErrors.map(err => ({ field: key, error: err })));
    }
  });
  
  // 2. Validate for additional properties
  if (dsl.additionalProperties === false) {
    Object.keys(entity).forEach(key => {
      if (!dsl.properties.some(property => property[key])) {
        errors.push({ field: key, error: "is not allowed" });
      }
    });
  }
  
  return errors;
}
  

function createEntityFromDSL(dsl, input = {}) {

  const validationErrors = validateEntity(dsl, input);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed with errors: ${JSON.stringify(validationErrors)}`);
  }

  return dsl.properties.reduce((entity, property) => {
    const [key, descriptor] = Object.entries(property)[0];
    const type = typeof descriptor === "string" ? descriptor : descriptor.type;
  
    if (input[key]) {
      entity[key] = input[key];
    } else if (descriptor.defaultValue !== undefined) {
      entity[key] = descriptor.defaultValue;
    } else if (initializers[type]) {
      entity[key] = initializers[type](descriptor, createEntityFromDSL);
    }
  
    return entity;
  }, {});
}

  
function typeToSchema(descriptor) {
  const type = typeof descriptor === "string" ? descriptor : descriptor.type;
  const handler = typeHandlers[type];
  if (!handler) throw new Error(`Unsupported type: ${type}`);
  return handler(descriptor);
}
  

const dsl = {
  name: "product",
  required: ["name", "price"],
  properties: [
    { name: "string" },
    { 
      price: {
        type: "number",
        description: "The price of the product",
        minimum: 0,
        maximum: 1000
      }
    },
    {
      tags: {
        type: "array",
        description: "The tags of the product",
        items: {
          type: "string"
        },
        minItems: 1,
        maxItems: 5
      }
    },
    {
      details: {
        type: "object",
        properties: [
          {
            color: "string"
          },
          {
            weight: {
              type: "number",
              minimum: 0
            }
          }
        ]
      }
    }
  ]
};

export function processEntity(dsl, entity, isUpdate = false) {
  const validationErrors = validateEntity(dsl, entity);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed with errors: ${JSON.stringify(validationErrors)}`);
  }
  
  if (isUpdate) {
    entity.updated_at = initializers["timestamp"]({ defaultCurrentTimestamp: true });
  }
  
  return entity;
}
  

const jsonSchema = transformToJSONSchema(dsl);
console.log({jsonSchema});
// Usage
const product = createEntityFromDSL(dsl, { name: "Laptop", price: 500 });
console.log(product);

  