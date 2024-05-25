import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

import { generatePrompt, LLM, loadTemplate } from "../services/llm/index.js";
import { checkAndExecute, executeTasks } from "../utils.js";

const execAsync = util.promisify(exec);
const deps = {};

function readDirectory(directory) {
  const files = {};

  function traverseDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        const content = fs.readFileSync(fullPath, "utf8");
        files[fullPath] = content;
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

async function runESLintFix(files) {
  const fileArgs = files.join(" ");
  try {
    const { stdout, stderr } = await execAsync(`npx eslint --fix ${fileArgs}`);
    console.log("ESLint output:", stdout);
    console.error("ESLint errors:", stderr);
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
  } = options;
  const outputDirectory = `code/${refactoringFiles
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()}`;
  const contextFilePath = path.join(outputDirectory, "context.json");
  const promptFilePath = path.join(outputDirectory, "prompt.txt");
  const commitMessageFilePath = path.join(".git", "COMMIT_EDITMSG");
  fs.mkdirSync(outputDirectory, { recursive: true });

  const tasks = [
    {
      description: "Load template",
      key: "template",
      filePath: path.join(outputDirectory, "template.json"),
      operation: async () => loadTemplate("coding/refactor.json"),
    },
    {
      description: "Read context source directory and encode file contents",
      key: "contextFileMap",
      filePath: contextFilePath,
      operation: async () => {
        if (fs.existsSync(contextFilePath)) {
          const confirm = await checkAndExecute({
            description: "Context already exists. Fetch again?",
            operation: async () => false,
            prompt: true,
          });
          if (!confirm) {
            return JSON.parse(fs.readFileSync(contextFilePath, "utf8"));
          }
        }
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
        const exampleParams = deps.template.exampleParams;
        const generatedPrompt = generatePrompt(
          {
            contextSrc: JSON.stringify(deps.contextFileMap, null, 2),
            refactoringFiles,
            taskPrompt,
            exampleParams,
          },
          "coding/refactor.json",
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
        const response = await LLM.execute("bedrock", deps.prompt, {
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
        deps.refactoredFileMap.map((file) =>
          path.join(outputDirectory, file.filepath),
        ),
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
        const content = fs.readFileSync(eslintedFilepath, "utf-8");
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, content, "utf-8");
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
