import fs from "fs/promises";
import path from "path";

const buildTree = async (dirPaths, extensions = [".js", ".json"]) => {
  const tree = [];

  for (const dirPath of Array.isArray(dirPaths) ? dirPaths : [dirPaths]) {
    await fs.mkdir(dirPath, { recursive: true });
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);

      // Skip .git and node_modules directories
      if (
        item.isDirectory() &&
        (item.name === ".git" || item.name === "node_modules")
      ) {
        continue;
      }

      if (item.isDirectory()) {
        tree.push({
          type: "directory",
          name: item.name,
          path: itemPath,
          children: await buildTree(itemPath, extensions),
        });
      } else {
        if (!extensions || extensions.some((ext) => item.name.endsWith(ext))) {
          const content = await fs.readFile(itemPath, "utf8");
          tree.push({
            type: "file",
            name: item.name,
            path: itemPath,
            content,
          });
        }
      }
    }
  }

  return tree;
};

const formatTree = (tree, indent = "") => {
  let output = "";

  for (const item of tree) {
    if (item.type === "directory") {
      output += `${indent}├── ${item.name}\n`;
      output += formatTree(item.children, indent + "│   ");
    } else {
      output += `${indent}└── ${item.name}\n`;
    }
  }

  return output;
};

const formatFiles = (tree) => {
  let output = "";

  for (const item of tree) {
    if (item.type === "file") {
      output += `\n\`${item.path}\`:\n\n\`\`\`\`\`\`\`\n${item.content}\n\`\`\`\`\`\`\`\n\n`;
    } else if (item.type === "directory") {
      output += formatFiles(item.children);
    }
  }

  return output;
};

export const processFiles = async (dirPaths, extensions = [".js", ".json"]) => {
  const tree = await buildTree(dirPaths, extensions);
  const projectPaths = Array.isArray(dirPaths) ? dirPaths : [dirPaths];

  let output =
    projectPaths
      .map((projectPath) => `Project Path: ${projectPath}`)
      .join("\n") + "\n\nSource Tree:\n\n```\n";
  output += formatTree(tree);
  output += "```\n";

  output += formatFiles(tree);
  return output;
};

export const parseInput = async (filePath) => {
  const fullFilePath = path.resolve(process.cwd(), filePath);
  if (filePath.endsWith(".json")) {
    try {
      const data = await fs.readFile(fullFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read or parse JSON file:", error);
      throw error;
    }
  } else if (filePath.endsWith(".js")) {
    try {
      const module = await import(`file://${fullFilePath}`);
      return module.default;
    } catch (error) {
      console.error("Failed to import JS module:", error);
      throw error;
    }
  } else {
    throw new Error("Unsupported file type");
  }
};
