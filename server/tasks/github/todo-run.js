import { generatePrompt, LLM, loadTemplate } from "../../services/llm/index.js";
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
  const { contextSrc, label } = config;
  const tasks = [
    {
      description: "Fetch Todo tasks",
      key: "todoTasks",
      operation: async () => {
        // Fetch open issues labeled as Todo from GitHub using gh CLI
        const openIssues = await fetchOpenIssues(label).map((issue) => ({
          issueNumber: issue.number,
          title: issue.title,
          description: issue.body,
        }));
        return openIssues;
      },
    },
    {
      description: "Process Todo tasks",
      dependencies: ["todoTasks"],
      operation: async () => {
        for (const task of deps.todoTasks) {
          const { refactoringFiles, description, issueNumber } = task;

          const template = loadTemplate("coding/refactor-diff.js");
          const prompt = await generatePrompt(
            {
              contextSrc,
              refactoringFiles,
              description,
              strategy: "diff",
            },
            template,
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
