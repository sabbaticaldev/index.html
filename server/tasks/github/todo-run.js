import { generatePrompt, LLM } from "aiflow/index.js";
import { importPatchContent } from "aiflow/utils/diff.js";
import { processFiles } from "aiflow/utils/files.js";
import { executeTasks } from "aiflow/utils/tasks.js";
import inquirer from "inquirer";

import {
  addComment,
  closeIssue,
  createPullRequest,
  fetchOpenIssues,
  getLabels,
  mergePullRequest,
} from "../../utils/github.js";

const deps = {};

async function promptUserForLabel(labels) {
  const { selectedLabel } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedLabel",
      message: "Select a label to work on:",
      choices: labels.filter((label) => label.startsWith("TODO-")),
    },
  ]);
  return selectedLabel;
}

export async function runTodoTasks({ config, template }) {
  console.log({ config, template });
  const labels = await getLabels();
  const selectedLabel = await promptUserForLabel(labels);
  try {
    const tasks = [
      {
        description: "Fetch Todo tasks",
        key: "todoTasks",
        operation: async () => {
          const openIssues = (
            await fetchOpenIssues({
              labels: [selectedLabel],
            })
          )
            .map((issue) => ({
              issueNumber: issue.number,
              title: issue.title,
              description: issue.body,
            }))
            .reverse();
          return openIssues;
        },
      },
      {
        description: "Process Todo tasks",
        dependencies: ["todoTasks"],
        operation: async ({ config, template }) => {
          console.log({ template });
          for (const task of deps.todoTasks) {
            const { refactoringFiles, description, issueNumber } = task;
            const contextSrc = await processFiles(config.input);
            const templateFile = "coding/refactor-diff.js";
            const prompt = await generatePrompt(
              {
                contextSrc,
                refactoringFiles,
                taskPrompt: description,
                strategy: "diff",
              },
              templateFile,
              "diff",
            );
            const llmResponse = await LLM.execute("bedrock", prompt, {
              responseFormat: "diff",
            });

            const modifiedFiles = await importPatchContent(llmResponse, {
              dirPath: config.input,
            });
            console.log(
              `Task completed. Modified files: ${modifiedFiles.join(", ")}`,
            );

            // // Create a pull request with the changes
            // const prNumber = await createPullRequest(
            //   `Fix for issue #${issueNumber}`,
            //   // Execute LLM to generate refactor diff
            //   "Automated fix by LLM",
            //   `fix-issue-${issueNumber}`,
            // );

            // // Add a comment to the issue linking the pull request
            // await addComment(
            //   issueNumber,
            //   `Fix submitted in pull request #${prNumber}`,
            // );
            // // Create a pull request with the refactored changes
            // // Merge the pull request
            // await mergePullRequest(prNumber);

            // // Close the corresponding GitHub issue
            // await closeIssue(issueNumber);
          }
        },
      },
    ];

    await executeTasks({ tasks, deps, config });
  } catch (error) {
    console.error(
      `Error running Todo tasks for label ${selectedLabel}:`,
      error,
    );
  }
}
