import { generatePrompt, LLM } from "aiflow";
import { importPatchContent } from "aiflow/utils/diff.js";
import { processFiles } from "aiflow/utils/files.js";
import { executeTasks } from "aiflow/utils/tasks.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execAsync = util.promisify(exec);
const deps = {};
const isValidSrcPath = (src) =>
  (fs.existsSync(src) && fs.lstatSync(src).isDirectory()) || Array.isArray(src);
async function runESLintFix(files) {
  const fileArgs = files.join(" ");
  try {
    await execAsync(`npx eslint --fix ${fileArgs}`);
    console.log("EsLint succesful");
  } catch (error) {
    console.error("ESLint failed:", error);
  }
}
async function refactorFolder({ config, template }) {
  const {
    contextSrc,
    refactoringFiles,
    taskPrompt,
    responseFormat = "json",
    strategy = "file",
    llmProvider = "bedrock",
  } = config;
  const outputDirectory = `code/${refactoringFiles
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}`;
  const contextFilePath = path.join(outputDirectory, "context.txt");
  const promptFilePath = path.join(outputDirectory, "prompt.txt");
  const refactoringFilesPath = path.join(
    outputDirectory,
    "refactoringFiles.txt",
  );
  const commitMessageFilePath = path.join(".git", "COMMIT_EDITMSG");
  const llmResponsePath = path.join(outputDirectory, "llmResponse.txt");
  const isDiff = strategy === "diff";
  fs.mkdirSync(outputDirectory, { recursive: true });
  const tasks = [
    {
      description: "Read context source directory and encode file contents",
      key: "contextSrc",
      filePath: contextFilePath,
      operation: async () => await processFiles(contextSrc),
    },
    {
      description: "Read refactoring files directory and encode file contents",
      key: "refactoringFiles",
      filePath: refactoringFilesPath,
      operation: async () =>
        isValidSrcPath(refactoringFiles)
          ? processFiles(refactoringFiles)
          : refactoringFiles,
    },
    {
      description: "Generate refactor prompt",
      key: "prompt",
      dependencies: ["template", "contextSrc", "refactoringFiles"],
      filePath: promptFilePath,
      operation: async () =>
        await generatePrompt(
          {
            contextSrc: deps.contextSrc,
            refactoringFiles: deps.refactoringFiles,
            taskPrompt,
            strategy,
          },
          template,
          responseFormat,
        ),
    },
    {
      description: "Execute LLM to refactor code",
      key: "llmResponse",
      dependencies: ["prompt"],
      filePath: llmResponsePath,
      operation: async () => {
        const response = await LLM.execute(llmProvider, deps.prompt, {
          responseFormat,
        });
        const commitMessage = response.commitMessage;
        if (commitMessage && fs.existsSync(".git")) {
          if (fs.existsSync(commitMessageFilePath))
            fs.unlink(commitMessage, () => {
              fs.writeFileSync(commitMessageFilePath, commitMessage, "utf-8");
              console.log(`Commit message saved at ${commitMessageFilePath}`);
            });
        }
        return isDiff ? response : response.files;
      },
    },
    {
      description: "Save refactored files from map",
      key: "savedFilePaths",
      condition: !isDiff && Array.isArray(deps.llmResponse),
      dependencies: ["llmResponse"],
      filePath: () =>
        (Array.isArray(deps.llmResponse)
          ? deps.llmResponse
          : Object.values(deps.llmResponse)
        ).map((file) => file.filePath),
      operation: async ({ index }) => {
        const file = deps.llmResponse[index];
        return file.content;
      },
    },
    {
      // TODO: refactor patch implementation to use stream and not use XML, this way we could apply the patch for each file as soon as it finishes, improving user feedback
      description: "Apply patch to refactored files",
      condition: isDiff,
      key: "savedFilePaths",
      dependencies: ["llmResponse"],
      operation: async () => {
        if (deps.llmResponse) {
          const files = await importPatchContent(deps.llmResponse, {
            dirPath: Array.isArray(contextSrc) ? contextSrc[0] : contextSrc,
          });
          return files;
        }
      },
    },
    {
      description: "Run ESLint fix on refactored files",
      dependencies: ["savedFilePaths"],
      operation: async ({ filePath }) => {
        await runESLintFix([filePath]);
      },
    },
  ];
  try {
    await executeTasks({ tasks, deps, prompt: true, config });
  } catch (error) {
    console.error("Error refactoring folder:", error);
    throw error;
  }
}

export default refactorFolder;
