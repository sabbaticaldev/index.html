import { input, select, Separator } from "@inquirer/prompts";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";

import settings from "../settings.js";
import { parseInput } from "./files.js";
import { executeTasks } from "./tasks.js";

const filesAutocomplete = async (input = "") => {
  const fullPath = path.resolve(input || ".");
  if (existsSync(fullPath) && statSync(fullPath).isFile()) {
    return [{ name: path.basename(fullPath), value: fullPath }];
  }
  const files = readdirSync(fullPath).map((file) => ({
    name: file,
    value: path.join(fullPath, file),
  }));
  return files;
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

const getConfig = async (input) => {
  const fullPath = path.resolve(input);
  return existsSync(fullPath) && statSync(fullPath).isDirectory()
    ? { input }
    : await parseInput(input);
};

const loadTaskDetails = async (selectedCommand) => {
  const promptMetadataPath = path.resolve(
    settings.__dirname,
    `prompts/${selectedCommand}/prompt.json`,
  );
  const templatePath = path.resolve(
    settings.__dirname,
    `prompts/${selectedCommand}/template.js`,
  );
  const operationPath = path.resolve(
    settings.__dirname,
    `prompts/${selectedCommand}/index.js`,
  );

  const metadata = JSON.parse(readFileSync(promptMetadataPath, "utf-8"));
  const template = (await import(templatePath)).default;
  const operation = (await import(operationPath)).default;
  return { metadata, template, operation };
};
const executeSelectedCommand = async (commands, command, input) => {
  try {
    const config = await getConfig(input);
    const selectedCommand = commands.find((c) => c === command);

    if (selectedCommand) {
      const task = await loadTaskDetails(selectedCommand);
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

export const start = async () => {
  const promptsDir = path.join(settings.__dirname, "prompts");
  const commands = readdirSync(promptsDir);
  console.log(process.argv);
  const [, , providedCommand, providedInput] = process.argv;
  const selectedCommand = commands.includes(providedCommand)
    ? providedCommand
    : null;
  const questions = [
    {
      type: "select",
      name: "command",
      message: "Select a command:",
      source: async () => [
        ...commands.map((folder) => ({
          name: folder,
          value: folder,
        })),
        new Separator(),
      ],
    },
    {
      type: "input",
      name: "input",
      message: "Enter the directory path or file name:",
      when: () => true,
    },
  ];

  if (selectedCommand && providedInput) {
    await executeSelectedCommand(commands, selectedCommand, providedInput);
    return;
  }

  try {
    const answers = await askQuestions(questions);
    const { command, input } = answers;
    await executeSelectedCommand(commands, command, input);
  } catch (error) {
    console.error("Error executing command:", error);
  }
};
