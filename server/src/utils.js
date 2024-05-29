import fs from "fs";
import path from "path";
import readline from "readline";
import { parseString } from "xml2js";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (question) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(["yes", "y", "1"].includes(answer.trim().toLowerCase()));
    });
  });

export const checkAndExecute = async ({
  description,
  filePath,
  operation,
  prompt,
}) => {
  let attempt = 0;
  while (true) {
    if (prompt && !filePath) {
      const confirm = await promptUser(
        `Proceed with ${description}? (yes/no): `,
      );
      if (!confirm) {
        console.log(`Operation ${description} was skipped by the user.`);
        return;
      }
    }
    if (filePath && fs.existsSync(filePath)) {
      if (
        prompt &&
        !(await promptUser(
          `File ${filePath} exists. Redo ${description}? (yes/no): `,
        ))
      ) {
        return filePath.endsWith(".json")
          ? JSON.parse(fs.readFileSync(filePath, "utf8"))
          : filePath;
      }
    }

    try {
      console.log("Running operation:", description);
      return await operation();
    } catch (error) {
      console.error(`Error during ${description}:`, error);
      attempt++;
      if (
        prompt &&
        !(await promptUser(
          `Attempt ${attempt} failed. Retry ${description}? (yes/no): `,
        ))
      ) {
        throw new Error(
          `User decided not to retry ${description} after failure.`,
        );
      }
    }
  }
};

export const executeTasks = async ({ tasks, prompt, deps = {} }) => {
  try {
    for (const task of tasks) {
      if (task.dependencies) {
        await Promise.all(task.dependencies.map((dep) => deps[dep]));
      }

      const result = await checkAndExecute({
        ...task,
        prompt,
        operation: async () => {
          const { filePath } = task;
          let files;
          if (Array.isArray(filePath)) {
            files = filePath;
          } else if (typeof filePath === "function") {
            files = filePath();
          }
          if (files)
            return await Promise.all(
              files.map((filepath, index) =>
                task.operation({ filepath, index }),
              ),
            );
          else {
            return await task.operation({ filepath: task.filePath });
          }
        },
      });

      if (task.key) {
        deps[task.key] = result;
      }
    }
  } catch (error) {
    console.error({ error });
  } finally {
    process.exit(0);
  }
};

export const fetchMapImage = async (mapUrl) => {
  const response = await fetch(mapUrl);
  return response.arrayBuffer();
};

export const parseXML = (xml) => {
  let result;
  parseString(
    xml,
    { explicitArray: false, mergeAttrs: true, explicitRoot: false },
    (err, parsedResult) => {
      if (err) {
        console.log({ err });
        throw new Error("Failed to parse XML");
      }

      // Transform <item> arrays back into proper arrays
      const transform = (obj) => {
        if (typeof obj !== "object" || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(transform);
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (key === "item" && Array.isArray(value)) {
            acc[key] = value.map(transform);
          } else if (typeof value === "object" && value.item) {
            acc[key] = Array.isArray(value.item)
              ? value.item.map(transform)
              : [transform(value.item)];
          } else {
            acc[key] = transform(value);
          }
          return acc;
        }, {});
      };

      result = transform(parsedResult);
    },
  );
  return result;
};

export const generateXMLFormat = (exampleOutput, rootElement = "root") => {
  const needsCDATA = (str) => {
    const pattern = /[^\w\s.,-]/; // Regex to check for non-alphanumeric characters and some allowed symbols
    return pattern.test(str);
  };

  const escapeXML = (str) => {
    if (typeof str === "string" && needsCDATA(str)) {
      return `<![CDATA[${str}]]>`;
    }
    return str;
  };

  const convertToXML = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return escapeXML(obj);
    }

    return Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `<${key}>${value
            .map((item) => `<item>${convertToXML(item)}</item>`)
            .join("")}</${key}>`;
        } else if (typeof value === "object") {
          return `<${key}>${convertToXML(value)}</${key}>`;
        } else {
          return `<${key}>${escapeXML(value)}</${key}>`;
        }
      })
      .join("");
  };

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<${rootElement}>
  ${convertToXML(exampleOutput)}
</${rootElement}>
`;
};

/**
 * Apply a unified diff patch to the original content.
 * Note: This is a simplified implementation and assumes the diffs
 * are straightforward and do not contain complex conflict resolutions.
 * @param {string} originalContent - The original content of the file.
 * @param {string} patchContent - The unified diff patch content.
 * @returns {string} - The new content with the patch applied.
 */
export function applyPatch(originalContent, patchContent) {
  const originalLines = originalContent.split("\n");
  const patchLines = patchContent.split("\n");
  let newContent = [...originalLines];
  let offset = 0;

  for (const line of patchLines) {
    if (line.startsWith("@@")) {
      // Example line: @@ -1,7 +1,7 @@
      // This regex extracts '1' from the starting position of the change in the original file
      const lineNumMatch = line.match(/\-(\d+),\d+ \+/);
      if (lineNumMatch && lineNumMatch.length > 1) {
        offset = parseInt(lineNumMatch[1], 10) - 1; // Adjust for zero-based index
      }
    } else if (line.startsWith("-")) {
      newContent.splice(offset, 1); // Remove line at current offset
    } else if (line.startsWith("+")) {
      newContent.splice(offset, 0, line.substring(1)); // Add new line at current offset
      offset++;
    } else if (line.startsWith(" ")) {
      offset++; // Unchanged line, move to next
    }
  }

  return newContent.join("\n");
}

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
