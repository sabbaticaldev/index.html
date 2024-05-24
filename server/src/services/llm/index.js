// src/services/llm/index.js
import fs from "fs";
import path from "path";

import settings from "../../settings.js";
import bedrock from "./engines/bedrock.js";

const LLM = (() => {
  const client = {
    bedrock: bedrock(settings),
  };

  return {
    execute: async (provider, prompt) => {
      const llmClient = client[provider];
      if (!llmClient) {
        throw new Error(`Unsupported LLM provider: ${provider}`);
      }

      try {
        const response = await llmClient(prompt);
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

const generatePrompt = (config, templateData, specificData) => {
  const { postDescription, contentStyle, captionStyle, persona = "AllForTraveler", hashtags = [] } = config;
  const formattedHashtags = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(" ") : "";
  const formatParams = templateData.formatParams;
  const exampleParams = templateData.exampleParams;

  const format = Object.entries(formatParams).map(([key, value]) => {
    return value === null ? `"${key}",` : `"${key}", // ${value}`;
  }).join("\n    ");

  const example = Object.entries(exampleParams).map(([key, value]) => {
    return `"${key}": "${value}"`;
  }).join(",\n    ");

  let prompt = specificData.prompt
    .replace("{persona}", templateData.persona || "AllForTraveler")
    .replace("{postDescription}", postDescription)
    .replace("{formattedHashtags}", formattedHashtags)
    .replace("{tone}", templateData.tone || specificData.tone)
    .replace("{expectedFormat}", `Expected format:\n{\n    ${format}\n}`)
    .replace("{example}", `Example:\n{\n    ${example}\n}`);

  if (contentStyle) {
    prompt += `\nFor the content style, use this as reference: ${contentStyle}`;
  }
  if (captionStyle) {
    prompt += `\nFor the caption style, use this as reference: ${captionStyle}`;
  }

  return prompt;
};

export { generatePrompt, LLM, loadTemplate };
