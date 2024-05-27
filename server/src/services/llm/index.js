import fs from "fs";
import path from "path";

import settings from "../../settings.js";
import { generateXMLFormat, parseXML } from "../../utils.js";
import bedrock from "./engines/bedrock.js";
const LLM = (() => {
  const client = { bedrock: bedrock(settings) };
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
  inputParameters.forEach((param) => {
    const value = JSON.stringify(config[param], null, 2) || "";
    const placeholder = `{${param}}`;
    prompt = prompt.replace(placeholder, value);
  });
  const exampleInput = generateExample(templateData.exampleInput);
  const exampleOutput = generateExample(
    templateData.exampleOutput,
    responseFormat,
  );
  console.log({ exampleOutput });
  prompt = prompt.replace(
    "Input:\n{exampleInput}\nOutput:\n{exampleOutput}",
    `Input:\n${exampleInput}\nOutput:\n${exampleOutput}`,
  );
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
    console.log({ error });
    return response;
  }
};
export { cleanLLMResponse, generatePrompt, LLM, loadTemplate };
