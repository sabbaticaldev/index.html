import { generatePrompt, LLM } from "../../services/llm/index.js";
import { executeTasks } from "../../utils.js";
import {
  addComment,
  closeIssue,
  createPullRequest,
  fetchOpenIssues,
  mergePullRequest,
} from "../../utils/github.js";
import { importPatchContent } from "../import/patch.js";

const deps = {};

export async function runTodoTasks(config = {}) {
  const { taskPrompt, contextSrc, labels } = config;
  const tasks = [
    {
      description: "Fetch Todo tasks",
      key: "todoTasks",
      operation: async () => {
        // Fetch open issues labeled as Todo from GitHub using gh CLI
        const openIssues = await fetchOpenIssues(labels).map((issue) => ({
          issueNumber: issue.number,
          title: issue.title,
          description: issue.body,
        }));

        const templateFile = "coding/github/run.js";
        const prompt = await generatePrompt(
          {
            contextSrc,
            taskPrompt,
            strategy: "diff",
            openIssues,
          },
          templateFile,
        );

        return await LLM.execute("bedrock", prompt, {
          responseFormat: "json",
          prefillMessage: "[",
        });
      },
    },
    {
      description: "Process Todo tasks",
      dependencies: ["todoTasks"],
      operation: async () => {
        for (const task of deps.todoTasks) {
          const { refactoringFiles, taskPrompt, issueNumber } = task;

          const templateFile = "coding/refactor-diff.js";
          const prompt = await generatePrompt(
            {
              contextSrc,
              refactoringFiles,
              taskPrompt,
              strategy: "diff",
            },
            templateFile,
            "diff",
          );

          const llmResponse = await LLM.execute("bedrock", prompt, {
            responseFormat: "diff",
          });

          const modifiedFiles = await importPatchContent(llmResponse);
          console.log(
            `Task completed. Modified files: ${modifiedFiles.join(", ")}`,
          );

          // Create a pull request with the changes
          const prNumber = await createPullRequest(
            `Fix for issue #${issueNumber}`,
            "Automated fix by LLM",
            `fix-issue-${issueNumber}`,
          );

          // Add a comment to the issue linking the pull request
          await addComment(
            issueNumber,
            `Fix submitted in pull request #${prNumber}`,
          );

          // Merge the pull request
          await mergePullRequest(prNumber);

          // Close the corresponding GitHub issue
          await closeIssue(issueNumber);
        }
      },
    },
  ];

  try {
    await executeTasks({ tasks, deps });
  } catch (error) {
    console.error("Error running Todo tasks:", error);
  }
}
