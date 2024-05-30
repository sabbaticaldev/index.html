import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import { generatePrompt, LLM } from "../services/llm/index.js";
import { applyPatch, executeTasks } from "../utils.js";
const execAsync = util.promisify(exec);
const deps = {};
function readDirectory(source) {
  const files = {};
  function traverseDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        const content = fs.readFileSync(fullPath, "utf8");
        files[fullPath] = content;
      }
    }
  }
  if (Array.isArray(source)) {
    source.forEach(traverseDirectory);
  } else {
    traverseDirectory(source);
  }
  return files;
}
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
  const contextFilePath = path.join(outputDirectory, "context.json");
  const promptFilePath = path.join(outputDirectory, "prompt.txt");
  const commitMessageFilePath = path.join(".git", "COMMIT_EDITMSG");

  const template = strategy === "diff" ? "refactor-diff" : "refactor";
  const templateFile = `coding/${template}.json`;
  fs.mkdirSync(outputDirectory, { recursive: true });
  const tasks = [
    {
      description: "Read context source directory and encode file contents",
      key: "contextFileMap",
      filePath: contextFilePath,
      operation: async () => {
        const contextFileMap = readDirectory(contextSrc);
        fs.writeFileSync(
          contextFilePath,
          JSON.stringify(contextFileMap, null, 2),
        );
        return contextFileMap;
      },
    },
    {
      description: "Read refactoring files directory and encode file contents",
      key: "refactoringFileMap",
      filePath: path.join(outputDirectory, "refactoringFileMap.json"),
      operation: async () => {
        if (
          fs.existsSync(refactoringFiles) &&
          fs.lstatSync(refactoringFiles).isDirectory()
        ) {
          return readDirectory(refactoringFiles);
        }
        return null;
      },
    },
    {
      description: "Generate refactor prompt",
      key: "prompt",
      dependencies: ["template", "contextFileMap", "refactoringFileMap"],
      filePath: promptFilePath,
      operation: async () => {
        const generatedPrompt = generatePrompt(
          {
            contextSrc: JSON.stringify(deps.contextFileMap, null, 2),
            refactoringFiles,
            taskPrompt,
            strategy,
          },
          templateFile,
          responseFormat,
        );
        fs.writeFileSync(promptFilePath, generatedPrompt);
        return generatedPrompt;
      },
    },
    {
      description: "Execute LLM to refactor code",
      key: "refactoredFileMap",
      dependencies: ["prompt"],
      filePath: path.join(outputDirectory, "refactoredFileMap.json"),
      operation: async () => {
        const response = await LLM.execute(llmProvider, deps.prompt, {
          responseFormat,
        });
        fs.writeFileSync(
          path.join(outputDirectory, "llmResponse.json"),
          JSON.stringify(response, null, 2),
        );
        const commitMessage = response.commitMessage;
        if (commitMessage && fs.existsSync(".git")) {
          fs.writeFileSync(commitMessageFilePath, commitMessage, "utf-8");
          console.log(`Commit message saved at ${commitMessageFilePath}`);
        }
        return response?.files || [];
      },
    },
    {
      description: "Save refactored files from map",
      key: "savedFilePaths",
      dependencies: ["refactoredFileMap"],
      filePath: () =>
        (Array.isArray(deps.refactoredFileMap)
          ? deps.refactoredFileMap
          : Object.values(deps.refactoredFileMap)
        ).map((file) => path.join(outputDirectory, file.filepath)),
      operation: async ({ filepath, index }) => {
        const file = deps.refactoredFileMap[index];
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, file.content, "utf-8");
        return filepath;
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
    {
      description: "Prompt and save files to original path",
      dependencies: ["refactoredFileMap", "savedFilePaths"],
      filePath: () =>
        (deps.refactoredFileMap || []).map((file) => file.filepath),
      operation: async ({ filepath, index }) => {
        const eslintedFilepath = deps.savedFilePaths[index];

        const fullPath = path.join(outputDirectory, filepath);
        const content = fs.readFileSync(eslintedFilepath, "utf-8");
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        console.log({ fullPath });
        if (strategy === "diff") {
          const originalContent = fs.readFileSync(filepath, "utf-8");
          const newContent = applyPatch(originalContent, content);
          fs.writeFileSync(filepath, newContent, "utf-8");
        } else {
          fs.writeFileSync(filepath, content, "utf-8");
        }
        return content;
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
