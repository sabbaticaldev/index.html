import fs from "fs";
import path from "path";

// File operations
export const fileExists = (filePath) => fs.existsSync(filePath);
export const isFile = (filePath) => fs.statSync(filePath).isFile();
export const isDirectory = (filePath) => fs.statSync(filePath).isDirectory();
export const readFile = (filePath) => fs.readFileSync(filePath, "utf-8");
export const readDir = (dirPath) => fs.readdirSync(dirPath);
export const createDir = (dirPath) =>
  fs.promises.mkdir(dirPath, { recursive: true });
export const writeFile = (filePath, data) =>
  fs.promises.writeFile(filePath, data, "utf-8");
export const importFile = async (filePath) => (await import(filePath)).default;

// Path operations
export const resolvePath = (...args) =>
  !console.log(args) && path.resolve(...args);
export const joinPath = (...args) => path.join(...args);
export const dirname = (filePath) => path.dirname(filePath);
export const basename = (filePath) => path.basename(filePath);

// File and directory structure operations
const buildTree = async (dirPaths, extensions = [".js", ".json"]) => {
  const tree = [];

  for (const dirPath of Array.isArray(dirPaths) ? dirPaths : [dirPaths]) {
    await createDir(dirPath);
    const items = readDir(dirPath, { withFileTypes: true });
    for (const item of items) {
      const itemPath = joinPath(dirPath, item.name);

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
          const content = readFile(itemPath);
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
  try {
    if (filePath.endsWith(".json")) {
      const data = readFile(filePath);
      return JSON.parse(data);
    } else if (filePath.endsWith(".js")) {
      return await importFile(`file://${filePath}`);
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error(`Failed to process file ${filePath}:`, error);
    throw error;
  }
};
