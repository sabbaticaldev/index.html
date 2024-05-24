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

const loadPromptData = (task, promptFile) => {
  const filePath = path.join(settings.__dirname, "prompts", task, promptFile);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const generatePrompt = (config, promptData) => {
  const { postDescription, contentStyle, captionStyle, persona = "AllForTraveler", hashtags = [] } = config;
  const personaDetails = promptData.persona || "AllForTraveler";
  const formattedHashtags = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(" ") : "";
  const formatParams = promptData.formatParams;
  const exampleParams = promptData.exampleParams;

  const format = Object.entries(formatParams).map(([key, value]) => {
    return value === null ? `"${key}",` : `"${key}", // ${value}`;
  }).join("\n    ");

  const example = Object.entries(exampleParams).map(([key, value]) => {
    return `"${key}": "${value}"`;
  }).join(",\n    ");

  return `
      Create a social media post for the persona: ${personaDetails}.
      Tone: ${promptData.tone}
      ------
      Based on this description: "${postDescription}"

      Expected format:
      {
        ${format}
      }
      
      Example:
      {
        ${example}
      }

      ${contentStyle ? `For the content style, use this as reference: ${contentStyle}` : ""}
      ${captionStyle ? `For the caption style, use this as reference: ${captionStyle}` : ""}
      ${formattedHashtags ? `Hashtags: ${formattedHashtags}` : ""}
    `;
};

export { generatePrompt,LLM, loadPromptData };
