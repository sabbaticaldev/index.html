import { generatePrompt, LLM } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";
import {
  authenticateGitHub,
  closeIssue,
  createIssue,
  createPullRequest,
  mergePullRequest,
  sshKeyPath,
} from "../utils/github.js";
import { importPatchContent } from "./import.js";

export async function createTODOTasks(config) {
  const { projectPath } = config;
  await authenticateGitHub(sshKeyPath);

  // TODO: Implement logic to create TODO tasks based on project configuration
  // This could involve analyzing the project structure, files, dependencies, etc.
  // and generating a list of tasks that need to be completed.

  // Create GitHub issues for each TODO task
  for (const task of tasks) {
    const { title, description } = task;
    await createIssue(title, description);
  }

  console.log(`TODO tasks created for project: ${projectPath}`);
}

export async function runTODOTasks() {
  await authenticateGitHub(sshKeyPath);
  // TODO: Implement logic to fetch TODO tasks from a data source (e.g., file, database)
  const tasks = []; // Placeholder for fetched tasks

  for (const task of tasks) {
    const { contextSrc, refactoringFiles, taskPrompt } = task;

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

    console.log(`Task completed. Modified files: ${modifiedFiles.join(", ")}`);

    // Close the corresponding GitHub issue
    await closeIssue(task.issueNumber);

    // Create a pull request with the changes
    await createPullRequest(
      `Fix for issue #${task.issueNumber}`,
      "Automated fix by LLM",
      `fix-issue-${task.issueNumber}`,
    );

    // Merge the pull request
    await mergePullRequest(task.prNumber);
  }
}
