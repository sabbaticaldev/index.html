import fs from "fs";
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
        console.log({ err, length: xml.length, last: xml.slice(-500) });
        throw new Error("Failed to parse XML");
      }

      // Transform <item> arrays back into proper arrays
      const transform = (obj) => {
        if (typeof obj !== "object" || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(transform);
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (key === "item" && Array.isArray(value)) {
            acc = value.map(transform);
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

export const generateXMLFormat = (exampleOutput, rootElement = "files") => {
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
</${rootElement}>`;
};
