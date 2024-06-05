import { generatePrompt, LLM } from "../../services/llm/index.js";
import { executeTasks } from "../../utils.js";
import {
  addComment,
  closeIssue,
  createPullRequest,
  fetchOpenIssues,
  mergePullRequest,
} from "../../utils/github.js";
import { importPatchContent } from "../import.js";

const deps = {};

export async function runTodoTasks(config) {
  const tasks = [
    {
      description: "Fetch Todo tasks",
      key: "todoTasks",
      operation: async () => {
        // Fetch open issues labeled as Todo from GitHub using gh CLI
        const { stdout } = await fetchOpenIssues(config.labels);
        const openIssues = JSON.parse(stdout);
        return openIssues.map((issue) => ({
          issueNumber: issue.number,
          title: issue.title,
          description: issue.body,
          contextSrc: issue.body.contextSrc, // Assuming contextSrc is stored in the issue body or as a label
          refactoringFiles: issue.body.refactoringFiles, // Assuming refactoringFiles is stored in the issue body or as a label
          taskPrompt: issue.body.taskPrompt, // Assuming taskPrompt is stored in the issue body or as a label
        }));
      },
    },
    {
      description: "Process Todo tasks",
      dependencies: ["todoTasks"],
      operation: async () => {
        for (const task of deps.todoTasks) {
          const { contextSrc, refactoringFiles, taskPrompt, issueNumber } =
            task;

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
