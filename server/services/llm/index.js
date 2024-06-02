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
const loadTemplate = (templateFile) => {
  const filePath = path.join(settings.__dirname, "prompts", templateFile);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};
const generatePrompt = (config, templateFile, responseFormat) => {
  const templateData = loadTemplate(templateFile);
  let prompt = templateData.prompt;
  const inputParameters = Object.keys(templateData.inputParams);
  const allParameters = inputParameters.concat([
    "exampleInput",
    "persona",
    "exampleOutput",
  ]);
  allParameters.forEach(async (param) => {
    let value;
    if (param === "exampleInput") {
      value = formatResponse(templateData.exampleInput);
    } else if (param === "persona") {
      value = JSON.stringify(await getPersonaDetails(config.persona), null, 2);
    } else if (param === "exampleOutput") {
      value = formatResponse(templateData.exampleOutput, responseFormat);
    } else {
      value = JSON.stringify(config[param], null, 2) || "";
    }
    const placeholder = `{${param}}`;

    prompt = prompt.replace(placeholder, value);
  });
  return prompt;
};
const formatResponse = (responseFormat, exampleData, rootElement) => {
  const formatters = {
    json: () => JSON.stringify(exampleData, null, 2),
    xml: () => generateXMLFormat(exampleData, rootElement),
    diff: () => exampleData,
  };

  return formatters[responseFormat] ? formatters[responseFormat]() : "";
};

const cleanLLMResponse = (response, format) => {
  try {
    if (format === "json") {
      const firstBraceIndex = response.indexOf("{");
      const lastBraceIndex = response.lastIndexOf("}");
      if (firstBraceIndex !== -1 && lastBraceIndex !== -1) {
        response = response.slice(firstBraceIndex, lastBraceIndex + 1);
      }
      return JSON.parse(response);
    } else if (format === "xml") {
      const firstTagIndex = response.indexOf("<");
      const lastTagIndex = response.lastIndexOf(">");
      if (firstTagIndex !== -1 && lastTagIndex !== -1) {
        response = response.slice(firstTagIndex, lastTagIndex + 1);
      }
      return parseXML(response);
    } else {
      return response.trim();
    }
  } catch (error) {
    return response;
  }
};
export { cleanLLMResponse, generatePrompt, LLM, loadTemplate };
