import fs from "fs";
import path from "path";

import { PREFILL_DIFF, PREFILL_JSON, PREFILL_XML } from "../../constants.js";
import settings from "../../settings.js";
import { generateXMLFormat, parseXML } from "../../utils.js";
import bedrock from "./engines/bedrock.js";
import openai from "./engines/openai.js";

const personasPath = path.join(settings.__dirname, "./personas.json");

export const loadPersonas = () => {
  const data = fs.readFileSync(personasPath, "utf8");
  return JSON.parse(data);
};

export const getPersonaDetails = (persona) => {
  const personas = loadPersonas();
  return personas[persona] || null;
};

const LLM = (() => {
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
        return cleanLLMResponse(response, options);
      } catch (error) {
        console.error("Error executing LLM request:", error);
        throw error;
      }
    },
  };
})();

const cleanLLMResponse = (
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
    console.log(formatHandlers[responseFormat]);
    return formatHandlers[responseFormat]
      ? formatHandlers[responseFormat](response)
      : formatHandlers.default(response);
  } catch (error) {
    return response;
  }
};

const loadTemplate = async (templateFile) => {
  const filePath = path.join(settings.__dirname, "prompts", templateFile);
  const templateData = await import(filePath);
  return templateData.default;
};

const generatePrompt = async (config, templateFile, responseFormat) => {
  const templateData = await loadTemplate(templateFile);
  const inputParameters = await prepareInputParameters(
    config,
    templateData,
    responseFormat,
  );
  return templateData.prompt(inputParameters);
};

const prepareInputParameters = async (config, templateData, responseFormat) => {
  const params = { ...config };

  params.exampleInputOutput = formatExamplePairs(
    templateData.exampleInput,
    templateData.exampleOutput,
    responseFormat,
  );
  params.persona = JSON.stringify(
    await getPersonaDetails(config.persona),
    null,
    2,
  );

  return params;
};

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

export { cleanLLMResponse, generatePrompt, LLM, loadTemplate };
