import * as fileUtils from "../engines/node/fs.js";

const maxAttempts = 5;

export const checkAndExecute = async ({
  description,
  filePath,
  operation,
  config,
  condition,
}) => {
  let attempt = 0;
  while (attempt < maxAttempts) {
    if (condition !== undefined) {
      const conditionResult =
        typeof condition === "function"
          ? await condition({ config })
          : condition;
      if (!conditionResult) {
        console.log(`Condition not met for ${description}, skipping...`);
        return;
      }
    }
    if (filePath && await fileUtils.fileExists(filePath)) {
      console.log(`File ${filePath} exists. Skipping ${description}.`);
      const file = await fileUtils.readFile(filePath);
      return filePath.endsWith(".json") ? JSON.parse(file) : file;
    }
    try {
      console.log("Running operation:", description);
      const response = await operation({ config, filePath });
      if (filePath) {
        fileUtils.writeFile(
          filePath,
          typeof response === "string" ? response : JSON.stringify(response),
        );
      }
      return response;
    } catch (error) {
      console.error(`Error during ${description}:`, error);
      attempt++;
      if (attempt >= maxAttempts) {
        throw new Error(`Max attempts reached for ${description}`);
      }
    }
  }
};

export const executeTasks = async ({ tasks, config = {}, deps = {} }) => {
  for (const task of tasks) {
    const result = await checkAndExecute({
      ...task,
      config,
      operation: async (config) => {
        const { filePath } = task;
        let files;
        if (Array.isArray(filePath)) {
          files = filePath;
        } else if (typeof filePath === "function") {
          files = filePath();
        }
        if (files) {
          return await Promise.all(
            files.map((filePath, index) =>
              task.operation({ ...config, ...task, filePath, index }),
            ),
          );
        } else {
          return await task.operation({
            ...task,
            ...config,
            filePath: task.filePath,
          });
        }
      },
    });

    if (task.key) {
      deps[task.key] = result;
    }
  }
};
