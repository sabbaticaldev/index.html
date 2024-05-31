/**
 * Applies the parsed patches to the given files.
 * @param {Object} filesContent - An object where keys are file paths and values are file contents.
 * @param {Object} patches - An object where keys are file paths and values are objects containing the new file path and patch lines.
 * @returns {Object} - An object where keys are new file paths and values are the updated file contents.
 */
export function applyParsedPatches(filesContent, patches) {
  const updatedFiles = {};
  for (const [oldFilePath, { newFilePath, patchSection }] of Object.entries(
    patches,
  )) {
    const originalContent = filesContent[oldFilePath] || "";
    const updatedContent = applyPatch(originalContent, patchSection);
    const targetPath = newFilePath || oldFilePath;
    updatedFiles[targetPath] = updatedContent;
  }
  return updatedFiles;
}

export function parsePatch(diff) {
  const lines = diff.split("\n");
  const operations = [];
  let currentOperation = { type: "", lines: [] };

  for (const line of lines) {
    if (line.startsWith("+")) {
      if (currentOperation.type !== "add") {
        if (currentOperation.type) operations.push(currentOperation);
        currentOperation = { type: "add", lines: [] };
      }
      currentOperation.lines.push(line.substring(1));
    } else if (line.startsWith("-")) {
      if (currentOperation.type !== "remove") {
        if (currentOperation.type) operations.push(currentOperation);
        currentOperation = { type: "remove", lines: [] };
      }
      currentOperation.lines.push(line.substring(1));
    } else {
      if (currentOperation.type) {
        operations.push(currentOperation);
        currentOperation = { type: "unchanged", lines: [] };
      }
    }
  }
  if (currentOperation.type) operations.push(currentOperation);
  return operations;
}

export function applyPatch(content, operations) {
  const contentLines = content.split("\n");
  const newContent = [];
  let i = 0;

  for (const operation of operations) {
    switch (operation.type) {
      case "add":
        newContent.push(...operation.lines);
        break;
      case "remove":
        i += operation.lines.length;
        break;
      case "unchanged":
        while (
        i < contentLines.length &&
          operation.lines.includes(contentLines[i])
      ) {
          newContent.push(contentLines[i]);
          i++;
        }
        break;
    }
  }

  return newContent.join("\n");
}
