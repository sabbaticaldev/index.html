import { processFiles } from "aiflow/utils/files.js";
import { LLM, prompt } from "aiflow/utils/llm.js";
import { executeTasks } from "aiflow/utils/tasks.js";

import { createIssue } from "../../server/utils/github.js";
import { getLabels } from "../../server/utils/github.js";

const deps = {};

export default async ({ config }) => {
  const { projectPath, taskPrompt } = config;
  const contextSrc = await processFiles(config.contextSrc);
  const tasks = [
    {
      description: "Generate LLM tasks",
      key: "llmTasks",
      operation: async () => {
        const labels = JSON.stringify(await getLabels());
        const promptMessage = await prompt(
          "todo-create",
          { taskPrompt, labels, contextSrc },
          "json",
        );
        return await LLM.execute("bedrock", promptMessage, {
          prefillMessage: "[",
        });
      },
    },
    {
      description: "Create GitHub issues for tasks",
      dependencies: ["llmTasks"],
      operation: async () => {
        if (!Array.isArray(deps.llmTasks)) return;
        for (const task of deps.llmTasks) {
          await createIssue(task);
        }
        return deps.llmTasks;
      },
    },
  ];

  try {
    await executeTasks({ tasks, deps, config });
    console.log(`Todo tasks created for project: ${projectPath}`);
  } catch (error) {
    console.error("Error creating Todo tasks:", error);
  }
};
