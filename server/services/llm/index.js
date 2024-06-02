import { response } from "express";
import fs from "fs";
import path from "path";

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
      const { responseFormat = "json" } = options;
      const llmClient = client[provider];
      if (!llmClient) {
        throw new Error(`Unsupported LLM provider: ${provider}`);
      }
      try {
        let response = await llmClient(prompt, options);
        response = cleanLLMResponse(response, responseFormat);
        return response;
      } catch (error) {
        console.error("Error executing LLM request:", error);
        throw error;
      }
    },
  };
})();
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
  for (const param in templateData.inputParams) {
    params[param] = JSON.stringify(config[param], null, 2) || "";
  }
  params.exampleInput = formatResponse(templateData.exampleInput);
  params.persona = JSON.stringify(
    await getPersonaDetails(config.persona),
    null,
    2,
  );
  params.exampleOutput = formatResponse(
    templateData.exampleOutput,
    responseFormat,
  );

  return params;
};

const formatResponse = (exampleData, responseFormat = "json", rootElement) => {
  const formatters = {
    json: () => JSON.stringify(exampleData, null, 2),
    xml: () => generateXMLFormat(exampleData, rootElement),
  };

  return formatters[responseFormat]
    ? formatters[responseFormat]()
    : exampleData;
};
const test = "\"";
const cleanLLMResponse = (response, format) => {
  try {
    const formatHandlers = {
      json: (res) => JSON.parse(res),
      xml: (res) => parseXML(res),
      diff: (res) => "---  " + res.trim(),
      default: (res) => res.trim(),
    };

    return formatHandlers[format]
      ? formatHandlers[format](response)
      : formatHandlers.default(response);
  } catch (error) {
    return response;
  }
};

export { cleanLLMResponse, generatePrompt, LLM, loadTemplate };
