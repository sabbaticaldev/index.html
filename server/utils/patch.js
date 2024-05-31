/**
 * Parses the patch content and returns an object with file paths and their respective patch lines.
 * @param {string} patchContent - The GitHub diff patch content.
 * @returns {Object} - An object where keys are file paths and values are arrays of patch lines.
 */
export function parsePatch(patchContent) {
  const patchLines = patchContent.split("\n");
  const filePatches = {};
  let currentFile = null;
  let patchSection = [];

  for (const line of patchLines) {
    if (line.startsWith("diff --git")) {
      if (currentFile) {
        filePatches[currentFile] = patchSection;
        patchSection = [];
      }
      const fileMatch = line.match(/a\/(.+?) b\/(.+)/);
      if (fileMatch) {
        currentFile = fileMatch[2];
      }
    } else if (line.startsWith("---") || line.startsWith("+++")) {
      // Ignore these lines
    } else if (currentFile) {
      patchSection.push(line);
    }
  }
  if (currentFile) {
    filePatches[currentFile] = patchSection;
  }
  return filePatches;
}

/**
 * Applies a unified diff patch to the original content.
 * @param {string} originalContent - The original content of the file.
 * @param {Array<string>} patchLines - The unified diff patch lines for the file.
 * @returns {string} - The new content with the patch applied.
 */
export function applyPatch(originalContent, patchLines) {
  const originalLines = originalContent.split("\n");
  let newContent = [...originalLines];
  let offset = 0;

  for (const line of patchLines) {
    if (line.startsWith("@@")) {
      const lineNumMatch = line.match(/-(\d+),\d+ \+/);
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
