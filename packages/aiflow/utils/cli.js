/**
 * Utility functions for the aiflow CLI.
 * @module utils/cli
 */
import { input, select } from "@inquirer/prompts";
import * as fileUtils from "../engines/node/fs.js";
import { FLOWS_DIR } from "../constants.js";
import { parseInput } from "./files.js";

/**
 * Provides autocomplete suggestions for file paths based on the given input.
 * @param {string} input - The user input for the file path.
 * @returns {Array} An array of autocomplete suggestions for file paths.
 */
export const filesAutocomplete = async (input) => {
  const fullPath = fileUtils.resolvePath(input || ".");
  if (await fileUtils.isFile(fullPath)) {
    return [{ name: fileUtils.basename(fullPath), value: fullPath }];
  }
  const files = await fileUtils.readDir(fullPath).map((file) => ({
    name: file,
    value: fileUtils.joinPath(fullPath, file),
  }));
  return files;
};

export const getConfig = async (input) => {
/**
 * Retrieves the configuration object based on the given input.
 * @param {string} input - The input file path or directory.
 * @returns {Promise<Object>} A promise that resolves to the configuration object.
 */
  const fullPath = fileUtils.resolvePath(input);
  const file = await fileUtils.isDirectory(fullPath)
      ? { input }
      : await parseInput(fullPath);
  return file;
};

// Load task details using file utilities
/**
 * Loads the task details based on the selected command.
 * @param {string} selectedCommand - The selected command.
 * @param {Object} settings - The application settings.
 * @returns {Promise<Object>} A promise that resolves to an object containing the task metadata, template, and operation.
 */
export const loadTaskDetails = async (selectedCommand, settings) => {
  const INDEX_FILE = 'index.js';
  const PROMPT_FILE = 'prompt.json';

  const promptMetadataPath = fileUtils.resolvePath(
    settings.__dirname,
    FLOWS_DIR,
    selectedCommand,
    PROMPT_FILE
  );
  const operationPath = fileUtils.resolvePath(
    settings.__dirname,
    FLOWS_DIR, 
    selectedCommand,
    INDEX_FILE
  );
    
  const metadata = JSON.parse(await fileUtils.readFile(promptMetadataPath));  
  const operation = await fileUtils.importFile(operationPath);

  return { metadata, operation };
};

/**
 * Prompts the user with a series of questions and returns their answers.
 * @param {Array} questions - An array of question objects.
 * @returns {Promise<Object>} A promise that resolves to an object containing the user's answers.
 */
export const askQuestions = async (questions) => {
  const answers = {};
  for (const question of questions) {
    const { type, name, message, source, when } = question;
    if (when && !when(answers)) continue;

    if (["list", "rawlist", "select"].includes(type)) {
      answers[name] = await select({
        message,
        choices: await source(answers),
      });
    } else if (type === "input") {
      answers[name] = await input({
        message,
        validate: async (input) => {
          const files = await filesAutocomplete(input);
          if (files.length > 0) {
            return true;
          } else {
            return `No files found in directory: ${input}`;
          }
        },
      });
    }
  }
  return answers;
};

/**
 * Executes the selected command based on the provided input and settings.
 * @param {Array} commands - An array of available commands.
 * @param {string} command - The selected command.
 * @param {string} input - The user input for the command.
 * @param {Object} settings - The application settings.
 * @param {Function} executeTasks - The function to execute the tasks.
 * @returns {Promise<void>} A promise that resolves when the command execution is complete.
 */
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
