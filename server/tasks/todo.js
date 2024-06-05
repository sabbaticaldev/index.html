import { generatePrompt, LLM } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";
import {
  addComment,
  authenticateGitHub,
  closeIssue,
  createIssue,
  createPullRequest,
  fetchOpenIssues,
  mergePullRequest,
  sshKeyPath,
} from "../utils/github.js";
import { importPatchContent } from "./import.js";

const deps = {};

export async function createTodoTasks(config) {
  const { projectPath, codebaseDescription } = config;
  await authenticateGitHub(sshKeyPath);

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

export async function runTodoTasks(config) {
  await authenticateGitHub(sshKeyPath);

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
