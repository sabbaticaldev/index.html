import { generatePrompt, LLM } from "../../services/llm/index.js";
import { executeTasks, processFiles } from "../../utils.js";
import { createIssue } from "../../utils/github.js";
import { getLabels } from "../../utils/github.js";

const deps = {};

export async function createTodoTasks(config) {
  const { projectPath, taskPrompt } = config;
  const contextSrc = await processFiles(config.contextSrc);

  const tasks = [
    {
      description: "Generate LLM tasks",
      key: "llmTasks",
      operation: async () => {
        const labels = JSON.stringify(await getLabels());
        const prompt = await generatePrompt(
          { taskPrompt, labels, contextSrc },
          "coding/github/tasks.js",
          "json",
        );
        return await LLM.execute("bedrock", prompt, { prefillMessage: "[" });
      },
    },
    {
      description: "Create GitHub issues for tasks",
      dependencies: ["llmTasks"],
      operation: async () => {
        console.log(deps.llmTasks);
        if (!Array.isArray(deps.llmTasks)) return;
        for (const task of deps.llmTasks) {
          await createIssue(task);
        }
        return deps.llmTasks;
      },
    },
  ];

  try {
    await executeTasks({ tasks, deps });
    console.log(`Todo tasks created for project: ${projectPath}`);
  } catch (error) {
    console.error("Error creating Todo tasks:", error);
  }
}
