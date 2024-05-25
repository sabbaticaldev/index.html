
import fs from "fs";
import readline from "readline";
import { Builder,parseString } from "xml2js";

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptUser = question => new Promise(resolve => {
  rl.question(question, answer => {
    resolve(["yes", "y", "1"].includes(answer.trim().toLowerCase()));
  });
});

const checkAndExecute = async ({ description, filePath, operation, prompt }) => {
  let attempt = 0;
  while (true) {
    if (prompt && !filePath) {
      const confirm = await promptUser(`Proceed with ${description}? (yes/no): `);
      if (!confirm) {
        console.log(`Operation ${description} was skipped by the user.`);
        return;
      }
    }
    if (fs.existsSync(filePath)) {
      if (prompt && !await promptUser(`File ${filePath} exists. Redo ${description}? (yes/no): `)) {
        return filePath.endsWith(".json") ? JSON.parse(fs.readFileSync(filePath, "utf8")) : filePath;
      }
    }

    try {
      console.log("Running operation:", description);
      return await operation();
    } catch (error) {
      console.error(`Error during ${description}:`, error);
      attempt++;
      if (prompt && !await promptUser(`Attempt ${attempt} failed. Retry ${description}? (yes/no): `)) {
        throw new Error(`User decided not to retry ${description} after failure.`);
      }
    }
  }
};

export const executeTasks = async ({ tasks, prompt, deps = {} }) => {
  try {
    for (const task of tasks) {
      if (task.dependencies) {
        await Promise.all(task.dependencies.map(dep => deps[dep]));
      }
      const result = await checkAndExecute({ ...task, prompt });
      if (task.key) {
        deps[task.key] = result;
      }
    }
  } catch (error) {
    console.error({ error });
  } finally {
    rl.close();
  }
};

export const fetchMapImage = async mapUrl => {
  const response = await fetch(mapUrl);
  console.log({ mapUrl });
  return response.arrayBuffer();
};

export const parseXML = (xml) => {
  console.log(JSON.stringify(xml));
  let result;
  parseString(xml, { explicitArray: false }, (err, parsedResult) => {
    if (err) {
      console.log({err});
      throw new Error("Failed to parse XML");
    }
    result = parsedResult;
  });
  return result;
};

const escapeXML = (str) => {
  if (typeof str === "string") {
    return `<![CDATA[${str}]]>`;
  }
  return str;
};

export const convertToXML = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return escapeXML(obj);
  }

  return Object.entries(obj).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(item => `<${key.slice(0, -1)}>${convertToXML(item)}</${key.slice(0, -1)}>`).join("");
    } else if (typeof value === "object") {
      return `<${key}>${convertToXML(value)}</${key}>`;
    } else {
      return `<${key}>${escapeXML(value)}</${key}>`;
    }
  }).join("");
};