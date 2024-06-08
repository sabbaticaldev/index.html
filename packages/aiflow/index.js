import { input, select, Separator } from "@inquirer/prompts";

import { executeSelectedCommand, filesAutocomplete } from "./core.js";
import settings from "./settings.js";
import * as fileUtils from "./utils/files.js";
import { executeTasks } from "./utils/tasks.js";

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

export const start = async () => {
  const promptsDir = fileUtils.joinPath(settings.__dirname, "prompts");
  const commands = fileUtils.readDir(promptsDir);

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
    await executeSelectedCommand(
      commands,
      selectedCommand,
      providedInput,
      settings,
      executeTasks,
    );
    return;
  }

  try {
    const answers = await askQuestions(questions);
    const { command, input } = answers;
    await executeSelectedCommand(
      commands,
      command,
      input,
      settings,
      executeTasks,
    );
  } catch (error) {
    console.error("Error executing command:", error);
  }
};
