import fs from "fs";
import path from "path";

function readDirectory(sources, extensions = [".js"]) {
  const files = {};

  function traverseDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (
        entry.isFile() &&
        extensions.includes(path.extname(entry.name))
      ) {
        files[fullPath] = fs.readFileSync(fullPath, "utf8");
      }
    }
  }

  // Handle multiple source directories
  if (Array.isArray(sources)) {
    sources.forEach((source) => traverseDirectory(source));
  } else {
    traverseDirectory(sources);
  }

  return files;
}

export { readDirectory };
