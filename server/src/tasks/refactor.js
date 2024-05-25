import fs from "fs";
import path from "path";

import { generatePrompt, LLM, loadTemplate } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";

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
        const relativePath = path.relative(directory, fullPath);
        const content = fs.readFileSync(fullPath, "utf8");
        files[relativePath] = content;
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

function saveFilesFromMap(fileMap, targetDirectory) {
  for (const [relativePath, content] of Object.entries(fileMap)) {
    const fullPath = path.join(targetDirectory, relativePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
}

export async function refactorFolder(options) {
  const { contextFiles, refactoringFiles, taskPrompt, responseFormat = "json" } = options;
  const outputDirectory = `refactored_${new Date().getTime()}`;

  const tasks = [
    {
      description: "Load template",
      key: "template",
      operation: async () => loadTemplate("coding/refactor.json")
    },
    {
      description: "Read context source directory and encode file contents",
      key: "contextFileMap",
      operation: async () => readDirectory(contextFiles)
    },
    {
      description: "Read refactoring files directory and encode file contents",
      key: "refactoringFileMap",
      operation: async () => {
        if (fs.existsSync(refactoringFiles) && fs.lstatSync(refactoringFiles).isDirectory()) {
          return readDirectory(refactoringFiles);
        }
        return null;
      }
    },
    {
      description: "Generate refactor prompt",
      key: "prompt",
      dependencies: ["template", "contextFileMap", "refactoringFileMap"],
      operation: async () => {
        const exampleParams = deps.template.exampleParams;
        return generatePrompt({
          contextFiles: JSON.stringify(deps.contextFileMap, null, 2),
          targetFiles: JSON.stringify(deps.refactoringFileMap || {}, null, 2),
          taskPrompt,
          exampleParams
        }, "coding/refactor.json", responseFormat);
      }
    },
    {
      description: "Execute LLM to refactor code",
      key: "refactoredFileMap",
      dependencies: ["prompt"],
      operation: async () => {
        const response = await LLM.execute("bedrock", deps.prompt, {
          responseFormat
        });
        return response;
      }
    },
    {
      description: "Save refactored files from map",
      dependencies: ["refactoredFileMap"],
      operation: async () => {
        saveFilesFromMap(deps.refactoredFileMap, outputDirectory);
        console.log(`Refactored files saved at ${outputDirectory}`);
        return outputDirectory;
      }
    }
  ];

  try {
    await executeTasks({ tasks, prompt: true, deps });
  } catch (error) {
    console.error("Error refactoring folder:", error);
    throw error;
  }
}
