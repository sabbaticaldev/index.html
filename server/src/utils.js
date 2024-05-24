import fs from "fs";
import readline from "readline";

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
