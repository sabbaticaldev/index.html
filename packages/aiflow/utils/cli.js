import { input, select } from "@inquirer/prompts";

import * as fileUtils from "./files.js";

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
          const files = filesAutocomplete(input);
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
