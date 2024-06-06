import { generatePrompt, LLM } from "../../services/llm/index.js";
import { executeTasks } from "../../utils.js";
import { createIssue } from "../../utils/github.js";

const deps = {};

export async function createTodoTasks(config) {
  const { projectPath, taskPrompt } = config;

  const tasks = [
    {
      description: "Generate LLM tasks",
      key: "llmTasks",
      operation: async () => {
        const prompt = await generatePrompt(
          { taskPrompt },
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
        if (!Array.isArray(deps.llmTasks)) return;
        for (const task of deps.llmTasks) {
          const { title, description } = task;

          const issueNumber = await createIssue(title, description);
          task.issueNumber = issueNumber;
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
