import { PREFILL_DIFF, PREFILL_JSON, PREFILL_XML } from "./constants.js";
import bedrock from "./engines/bedrock.js";
import openai from "./engines/openai.js";
import settings from "./settings.js";
import * as fileUtils from "./utils/files.js";
import { generateXMLFormat, parseXML } from "./utils/xml.js";

export const filesAutocomplete = (input) => {
  const fullPath = fileUtils.resolvePath(input || ".");
  if (fileUtils.fileExists(fullPath) && fileUtils.isFile(fullPath)) {
    return [{ name: fileUtils.basename(fullPath), value: fullPath }];
  }
  const files = fileUtils.readDir(fullPath).map((file) => ({
    name: file,
    value: fileUtils.joinPath(fullPath, file),
  }));
  return files;
};

export const getConfig = async (input) => {
  const fullPath = fileUtils.resolvePath(input);
  const file =
    fileUtils.fileExists(fullPath) && fileUtils.isDirectory(fullPath)
      ? { input }
      : await fileUtils.parseInput(fullPath);
  console.log({ file });
  return file;
};

// Load task details using file utilities
export const loadTaskDetails = async (selectedCommand, settings) => {
  const promptMetadataPath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/prompt.json`,
  );
  const templatePath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/template.js`,
  );
  const operationPath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/index.js`,
  );

  const metadata = JSON.parse(fileUtils.readFile(promptMetadataPath));
  const template = await fileUtils.importFile(templatePath);
  const operation = await fileUtils.importFile(operationPath);

  return { metadata, template, operation };
};

// Execute the selected command
export const executeSelectedCommand = async (
  commands,
  command,
  input,
  settings,
  executeTasks,
) => {
  try {
    const config = await getConfig(input);
    const selectedCommand = commands.find((c) => c === command);
    if (selectedCommand) {
      const task = await loadTaskDetails(selectedCommand, settings);
      await executeTasks({
        config,
        tasks: [task],
      });
    } else {
      console.error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error("Error executing command:", error);
  }
};

// Load personas using file utilities
export const loadPersonas = () => {
  const personasPath = fileUtils.resolvePath(
    settings.__dirname,
    "./personas.json",
  );
  const data = fileUtils.readFile(personasPath);
  return JSON.parse(data);
};

// Get persona details
export const getPersonaDetails = (persona) => {
  const personas = loadPersonas();
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
        return cleanLLMResponse(response, options);
      } catch (error) {
        console.error("Error executing LLM request:", error);
        throw error;
      }
    },
  };
})();

// Clean LLM response
export const cleanLLMResponse = (
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
export const generatePrompt = async (config, template, responseFormat) => {
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
