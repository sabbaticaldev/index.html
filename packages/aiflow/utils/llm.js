import { PREFILL_DIFF, PREFILL_JSON, PREFILL_XML } from "../constants.js";
import bedrock from "../engines/bedrock.js";
import * as fileUtils from "../engines/node/fs.js";
import openai from "../engines/openai.js";
import settings from "../settings.js";
import { generateXMLFormat, parseXML } from "./xml.js";

// Load personas using file utilities
export const loadPersonas = async () => {};

// Get persona details
export const getPersonaDetails = async (persona) => {
  const personasPath = fileUtils.resolvePath(
    settings.__dirname,
    "./personas.json",
  );
  const data = await fileUtils.readFile(personasPath);
  const personas = JSON.parse(data);
  return personas[persona] || null;
};

// LLM client initialization
export const LLM = (() => {
  const {
    BEDROCK_MODEL_ID,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    OPENAI_API_KEY,
  } = settings;
  const client = {
    bedrock: bedrock({
      BEDROCK_MODEL_ID,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_REGION,
    }),
    openai: openai({ OPENAI_API_KEY }),
  };
  return {
    execute: async (provider, prompt, options = {}) => {
      const llmClient = client[provider];
      if (!llmClient) {
        throw new Error(`Unsupported LLM provider: ${provider}`);
      }
      try {
        const response = await llmClient(prompt, options);
        return normalizeResponse(response, options);
      } catch (error) {
        console.error("Error executing LLM request:", error);
        throw error;
      }
    },
  };
})();

const normalizeResponse = (
  response,
  { responseFormat = "json", prefillMessage },
) => {
  try {
    const formatHandlers = {
      json: (res) => JSON.parse((prefillMessage ?? PREFILL_JSON) + res),
      xml: (res) => parseXML((prefillMessage ?? PREFILL_XML) + res),
      diff: (res) => `${prefillMessage ?? PREFILL_DIFF}
${res.trim()}`,
      default: (res) => res.trim(),
    };
    return formatHandlers[responseFormat]
      ? formatHandlers[responseFormat](response)
      : formatHandlers.default(response);
  } catch (error) {
    return response;
  }
};

// Generate prompt
export const prompt = async (templateName, config, responseFormat) => {
  const template = await fileUtils.importFile(
    fileUtils.resolvePath("templates", templateName + ".js"),
  );
  const inputParameters = await prepareInputParameters(
    config,
    template,
    responseFormat,
  );
  return template.prompt(inputParameters);
};

// Prepare input parameters
const prepareInputParameters = async (config, template, responseFormat) => {
  const params = { ...config };

  params.exampleInputOutput = formatExamplePairs(
    template.exampleInput,
    template.exampleOutput,
    responseFormat,
  );
  params.persona = JSON.stringify(
    await getPersonaDetails(config.persona),
    null,
    2,
  );

  return params;
};

// Format example pairs
const formatExamplePairs = (
  exampleInputs,
  exampleOutputs,
  responseFormat = "json",
) => {
  const isPair = Array.isArray(exampleInputs) && Array.isArray(exampleOutputs);
  const inputs = isPair ? exampleInputs : [exampleInputs];
  const outputs = isPair ? exampleOutputs : [exampleOutputs];

  return inputs
    .map((input, index) => {
      const output = outputs[index] || outputs[0];
      return `Input:\n${formatResponse(
        input,
        responseFormat,
      )}\n\nOutput:\n${formatResponse(output, responseFormat)}`;
    })
    .join("\n\n");
};

// Format response
const formatResponse = (exampleData, responseFormat = "json", rootElement) => {
  const defaultFn = () => JSON.stringify(exampleData, null, 2);
  const formatters = {
    json: defaultFn,
    diff: defaultFn,
    xml: () => generateXMLFormat(exampleData, rootElement),
  };
  return formatters[responseFormat]
    ? formatters[responseFormat]()
    : exampleData;
};
