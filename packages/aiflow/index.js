/**
 * Main entry point for the aiflow application.
 * @module index
 */
import { FLOWS_DIR } from "./constants.js";
import * as fileUtils from "./engines/node/fs.js";
import settings from "./settings.js";
import { askQuestions, executeSelectedCommand } from "./utils/cli.js";
import { executeTasks } from "./utils/tasks.js";

export const start = async () => {
  const commands = await fileUtils.readDir(
    fileUtils.joinPath(settings.__dirname, FLOWS_DIR),
  );
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
