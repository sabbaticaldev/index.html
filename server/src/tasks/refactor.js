import fs from "fs";
import path from "path";

import { generatePrompt, LLM, loadTemplate } from "../services/llm/index.js";
import { executeTasks } from "../utils.js";

// Function to read directory and encode file contents
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
        files[relativePath] = Buffer.from(content).toString("base64");  // Encode content to base64
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

// Function to save files from the map
function saveFilesFromMap(fileMap, targetDirectory) {
  for (const [relativePath, encodedContent] of Object.entries(fileMap)) {
    const decodedContent = Buffer.from(encodedContent, "base64").toString("utf8");
    const fullPath = path.join(targetDirectory, relativePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, decodedContent);
  }
}

export async function refactorFolder(options) {
  const { directory } = options;
  const outputDirectory = `refactored_${new Date().getTime()}`;
  
  const tasks = [
    {
      description: "Read directory and encode file contents",
      key: "fileMap",
      operation: async () => readDirectory(directory)
    },
    {
      description: "Generate refactor prompt",
      key: "prompt",
      dependencies: ["fileMap"],
      operation: async (deps) => {
        const templateData = loadTemplate("refactorCode");
        return generatePrompt({ code: JSON.stringify(deps.fileMap, null, 2) }, templateData);
      }
    },
    {
      description: "Execute LLM to refactor code",
      key: "refactoredFileMap",
      dependencies: ["prompt"],
      operation: async (deps) => {
        return LLM.execute("bedrock", deps.prompt);
      }
    },
    {
      description: "Save refactored files from map",
      dependencies: ["refactoredFileMap"],
      operation: async (deps) => {
        saveFilesFromMap(deps.refactoredFileMap, outputDirectory);
        console.log(`Refactored files saved at ${outputDirectory}`);
        return outputDirectory;
      }
    }
  ];

  try {
    await executeTasks({ tasks, prompt: true });
  } catch (error) {
    console.error("Error refactoring folder:", error);
    throw error;
  }
}
