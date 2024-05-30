import fs from "fs";
import path from "path";

import settings from "../../settings.js";
import { generateXMLFormat, parseXML } from "../../utils.js";
import bedrock from "./engines/bedrock.js";
import openai from "./engines/openai.js";
const LLM = (() => {
  const client = { bedrock: bedrock(settings), openai: openai(settings) };
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
        console.log({ response });
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
    "exampleOutput",
  ]);
  console.log({ allParameters });
  allParameters.forEach((param) => {
    let value;
    if (param === "exampleInput") {
      value = generateExample(templateData.exampleInput);
    } else if (param === "exampleOutput") {
      value = generateExample(templateData.exampleOutput, responseFormat);
    } else {
      value = JSON.stringify(config[param], null, 2) || "";
    }
    const placeholder = `{${param}}`;

    prompt = prompt.replace(placeholder, value);
  });
  return prompt;
};
const generateExample = (exampleData, responseFormat = "json", rootElement) => {
  if (responseFormat === "json") {
    return JSON.stringify(exampleData, null, 2);
  } else if (responseFormat === "xml") {
    return generateXMLFormat(exampleData, rootElement);
  }
  return "";
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
