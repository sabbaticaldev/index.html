import settings from "./settings.js";
import { askQuestions, executeSelectedCommand } from "./utils/cli.js";
import * as fileUtils from "./utils/files.js";
import { executeTasks } from "./utils/tasks.js";

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
