import fs from "fs";
import path from "path";

import settings from "../../settings.js";
import { convertToXML, parseXML } from "../../utils.js";
import bedrock from "./engines/bedrock.js";

const LLM = (() => {
  const client = {
    bedrock: bedrock(settings),
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

  // Generate expected format based on responseFormat
  const generatedFormat = generateExpectedFormat(templateData.exampleOutput, responseFormat);
  prompt = prompt.replace("{expectedFormat}", generatedFormat);

  // Replace placeholders with actual values
  inputParameters.forEach((param) => {
    const value = JSON.stringify(config[param], null, 2) || "";
    const placeholder = `{${param}}`;
    prompt = prompt.replace(placeholder, value);
  });

  // Generate example input and output
  const exampleInput = generateExample(templateData.exampleInput, responseFormat, "files");
  const exampleOutput = generateExample(templateData.exampleOutput, responseFormat, "files");
  prompt = prompt.replace("{example}", `Input:\n${exampleInput}\nOutput:\n${exampleOutput}`);
  console.log({prompt});
  return prompt;
};

const generateExpectedFormat = (exampleOutput, responseFormat) => {
  if (responseFormat === "json") {
    return JSON.stringify(exampleOutput, null, 2);
  } else if (responseFormat === "xml") {
    return generateXMLFormat(exampleOutput, "files");
  }
  return "";
};

const generateExample = (exampleData, responseFormat, rootElement) => {
  if (responseFormat === "json") {
    return JSON.stringify(exampleData, null, 2);
  } else if (responseFormat === "xml") {
    return generateXMLFormat(exampleData, rootElement);
  }
  return "";
};

const generateXMLFormat = (exampleOutput, rootElement = "root") => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<${rootElement}>
  ${convertToXML(exampleOutput)}
</${rootElement}>`;
};
const cleanLLMResponse = (response, format) => {
  console.log({response, format});
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
    // Assuming plain text
    return response.trim();
  }
};

export { cleanLLMResponse,generatePrompt, LLM, loadTemplate };
