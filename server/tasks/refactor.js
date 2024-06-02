import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import { generatePrompt, LLM } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";
import { importPatchContent } from "./import.js";

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
  const isDiff = strategy === "diff";
  const template = isDiff ? "refactor-diff" : "refactor";
  const templateFile = `coding/${template}.js`;
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
        const generatedPrompt = await generatePrompt(
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
      key: "llmResponse",
      dependencies: ["prompt"],
      filePath: path.join(outputDirectory, "llmResponse.json"),
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

        return isDiff ? response.diffPatch : response.files;
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
