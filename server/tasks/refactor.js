import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import { generatePrompt, LLM } from "../services/llm/index.js";
import { executeTasks, processFiles } from "../utils.js";
import { importPatchContent } from "./import.js";

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
export async function refactorFolder(options) {
  const {
    contextSrc,
    refactoringFiles,
    taskPrompt,
    responseFormat = "json",
    strategy = "file",
    llmProvider = "bedrock",
  } = options;
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
  const template = isDiff ? "refactor-diff" : "refactor";
  const templateFile = `coding/${template}.js`;
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
          templateFile,
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
        //TODO: refactor diff to add a commit message file
        const commitMessage = response.commitMessage;
        if (commitMessage && fs.existsSync(".git")) {
          fs.writeFileSync(commitMessageFilePath, commitMessage, "utf-8");
          console.log(`Commit message saved at ${commitMessageFilePath}`);
        }
        isDiff && console.log({ response });
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
        ).map((file) => file.filepath),
      operation: async ({ filepath, index }) => {
        const file = deps.llmResponse[index];
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, file.content, "utf-8");
        return filepath;
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
          const files = await importPatchContent(deps.llmResponse);
          return files;
        }
      },
    },
    {
      description: "Run ESLint fix on refactored files",
      dependencies: ["savedFilePaths"],
      filePath: () => deps.savedFilePaths,
      operation: async ({ filepath }) => {
        await runESLintFix([filepath]);
        return filepath;
      },
    },
  ];
  try {
    await executeTasks({ tasks, deps, prompt: true });
  } catch (error) {
    console.error("Error refactoring folder:", error);
    throw error;
  }
}
