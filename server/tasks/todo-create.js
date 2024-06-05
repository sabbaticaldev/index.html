import { generatePrompt, LLM } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";
import { createIssue } from "../utils/github.js";

const deps = {};

export async function createTodoTasks(config) {
  const { projectPath, codebaseDescription } = config;

  const tasks = [
    {
      description: "Generate LLM tasks",
      key: "llmTasks",
      operation: async () => {
        const llm = LLM("bedrock");

        const prompt = await generatePrompt(
          { codebaseDescription },
          "coding/tasks-template.js",
          "json",
        );

        const llmResponse = await llm.execute(prompt);
        return JSON.parse(llmResponse);
      },
    },
    {
      description: "Create GitHub issues for tasks",
      dependencies: ["llmTasks"],
      operation: async () => {
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
