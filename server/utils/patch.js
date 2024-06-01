export function parsePatch(diff) {
  const lines = diff.split("\n");
  const patches = {};
  let currentFile = null;

  lines.forEach((line) => {
    if (line.startsWith("---")) {
      currentFile = null;
    } else if (line.startsWith("+++")) {
      currentFile = line.slice(4); // Ensure this captures the correct file path
      patches[currentFile] = { hunks: [] };
    } else if (currentFile && line.startsWith("@@")) {
      const hunk = parseHunk(line);
      patches[currentFile].hunks.push(hunk);
    } else if (currentFile && patches[currentFile]) {
      patches[currentFile].hunks[
        patches[currentFile].hunks.length - 1
      ].changes.push(line);
    }
  });

  return patches;
}

function parseHunk(header) {
  const match = header.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);
  return {
    oldStart: parseInt(match[1], 10),
    newStart: parseInt(match[2], 10),
    changes: [],
  };
}

export function applyPatch(originalContent, patchInfo) {
  const contentLines = originalContent.split("\n");
  let result = [...contentLines];
  let indexOffset = 0;

  for (const hunk of patchInfo.hunks) {
    // Find the best context match for the hunk in the original file
    const contextStartIndex = findContextStartIndex(
      contentLines,
      hunk.changes,
      hunk.oldStart,
    );
    const start = contextStartIndex + indexOffset; // Adjust start position by current offset if necessary
    const hunkLines = applyHunk(
      hunk.changes,
      contentLines.slice(contextStartIndex),
    );

    // Replace the lines in the result array
    result.splice(start, hunkLines.oldLength, ...hunkLines.newLines);
    indexOffset += hunkLines.newLines.length - hunkLines.oldLength;
  }

  return result.join("\n");
}

function findContextStartIndex(contentLines, changes, oldStart) {
  const context = changes
    .filter((line) => line.startsWith(" "))
    .map((line) => line.substring(1));
  const contextLength = context.length;
  let bestMatchIndex = oldStart - 1; // Default to oldStart if no better match found
  let maxMatchCount = 0;

  // Use a sliding window to find the best match for the context lines
  for (let i = 0; i <= contentLines.length - contextLength; i++) {
    let matchCount = 0;
    for (let j = 0; j < contextLength; j++) {
      if (contentLines[i + j] === context[j]) {
        matchCount++;
      }
    }
    // Update the best match if the current window has more matching lines
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatchIndex = i;
    }
  }

  return bestMatchIndex;
}

function applyHunk(changes, contextLines) {
  const newLines = [];
  let oldLength = 0;

  changes.forEach((line) => {
    if (line.startsWith("+")) {
      newLines.push(line.substring(1));
    } else if (line.startsWith("-")) {
      oldLength++;
    } else if (line.startsWith(" ")) {
      newLines.push(line.substring(1)); // Include unchanged lines to maintain context
      oldLength++;
    }
  });

  return { newLines, oldLength };
}

export function applyParsedPatches(filesContent, patches) {
  const updatedFiles = {};
  Object.entries(patches).forEach(([filePath, patchInfo]) => {
    const originalContent = filesContent[filePath] || "";
    updatedFiles[filePath] = applyPatch(originalContent, patchInfo);
  });
  return updatedFiles;
}
