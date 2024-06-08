import * as fileUtils from "./utils/files.js";

export const filesAutocomplete = (input) => {
  const fullPath = fileUtils.resolvePath(input || ".");
  if (fileUtils.fileExists(fullPath) && fileUtils.isFile(fullPath)) {
    return [{ name: fileUtils.basename(fullPath), value: fullPath }];
  }
  const files = fileUtils.readDir(fullPath).map((file) => ({
    name: file,
    value: fileUtils.joinPath(fullPath, file),
  }));
  return files;
};

export const getConfig = async (input, parseInput) => {
  const fullPath = fileUtils.resolvePath(input);
  return fileUtils.fileExists(fullPath) && fileUtils.isDirectory(fullPath)
    ? { input }
    : await parseInput(input);
};

export const loadTaskDetails = async (selectedCommand, settings) => {
  const promptMetadataPath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/prompt.json`,
  );
  const templatePath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/template.js`,
  );
  const operationPath = fileUtils.resolvePath(
    settings.__dirname,
    `prompts/${selectedCommand}/index.js`,
  );

  const metadata = JSON.parse(fileUtils.readFile(promptMetadataPath));
  const template = await fileUtils.importFile(templatePath);
  const operation = await fileUtils.importFile(operationPath);

  return { metadata, template, operation };
};

export const executeSelectedCommand = async (
  commands,
  command,
  input,
  settings,
  parseInput,
  executeTasks,
) => {
  try {
    const config = await getConfig(input, parseInput);
    const selectedCommand = commands.find((c) => c === command);

    if (selectedCommand) {
      const task = await loadTaskDetails(selectedCommand, settings);
      await executeTasks({
        config,
        tasks: [task],
      });
    } else {
      console.error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error("Error executing command:", error);
  }
};
