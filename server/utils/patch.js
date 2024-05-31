/**
 * Parses the patch content and returns an object with file paths and their respective patch lines.
 * @param {string} patchContent - The diff patch content.
 * @returns {Object} - An object where keys are file paths and values are objects containing the new file path and patch lines.
 */
export function parsePatch(patchContent) {
  console.log({ patchContent });
  const patchLines = patchContent.split("\n");
  const filePatches = {};
  let currentFile = null;
  let newFilePath = null;
  let patchSection = [];

  for (const line of patchLines) {
    if (line.startsWith("---")) {
      if (currentFile) {
        filePatches[currentFile] = { newFilePath, patchSection };
        patchSection = [];
      }
      const oldFileMatch = line.match(/--- (.+)/);
      if (oldFileMatch) {
        currentFile = oldFileMatch[1];
      }
    } else if (line.startsWith("+++")) {
      const newFileMatch = line.match(/\+\+\+ (.+)/);
      if (newFileMatch) {
        newFilePath = newFileMatch[1];
      }
    } else if (currentFile) {
      patchSection.push(line);
    }
  }

  if (currentFile) {
    filePatches[currentFile] = { newFilePath, patchSection };
  }

  return filePatches;
}

export function applyPatch(originalContent, patchLines) {
  const originalLines = originalContent.split("\n");
  const newContent = [];
  let offset = 0;
  let currentIndex = 0;

  for (const line of patchLines) {
    if (line.startsWith("@@")) {
      const lineNumMatch = line.match(/-(\d+),\d+ \+/);
      if (lineNumMatch && lineNumMatch.length > 1) {
        offset = parseInt(lineNumMatch[1], 10) - 1; // Adjust for zero-based index
        // Add unchanged lines before the patch starts
        while (currentIndex < offset) {
          newContent.push(originalLines[currentIndex]);
          currentIndex++;
        }
      }
    } else if (line.startsWith("-")) {
      currentIndex++; // Skip the line in the original content
    } else if (line.startsWith("+")) {
      newContent.push(line.substring(1)); // Add new line from the patch
    } else if (line.startsWith(" ")) {
      newContent.push(originalLines[currentIndex]); // Add unchanged line
      currentIndex++;
    }
  }

  // Add remaining unchanged lines from the original content
  while (currentIndex < originalLines.length) {
    newContent.push(originalLines[currentIndex]);
    currentIndex++;
  }

  return newContent.join("\n");
}

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
