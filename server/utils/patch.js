export const parsePatch = (diff) => {
  return diff.split("\n").reduce(
    (acc, line) => {
      if (line.startsWith("---")) {
        acc.currentFile = null;
      } else if (line.startsWith("+++")) {
        acc.currentFile = line.slice(4);
        acc.patches[acc.currentFile] = { hunks: [] };
      } else if (acc.currentFile && line.startsWith("@@")) {
        const hunk = parseHunk(line);
        acc.patches[acc.currentFile].hunks.push(hunk);
      } else if (acc.currentFile && acc.patches[acc.currentFile]) {
        const currentHunk = acc.patches[acc.currentFile].hunks.slice(-1)[0];
        currentHunk.changes.push(line);
      }
      return acc;
    },
    { patches: {}, currentFile: null },
  ).patches;
};

const parseHunk = (header) => {
  const match = header.match(/@@ -(\d+),\d+ \+(\d+),\d+ @@/);
  return {
    oldStart: parseInt(match[1], 10),
    newStart: parseInt(match[2], 10),
    changes: [],
  };
};

export const applyPatch = (originalContent, patchInfo) => {
  const contentLines = originalContent.split("\n");
  return patchInfo.hunks
    .reduce(
      (result, hunk) => {
        const contextStartIndex = findContextStartIndex(
          contentLines,
          hunk.changes,
          hunk.oldStart,
        );
        const start = contextStartIndex + result.indexOffset;
        const hunkLines = applyHunk(
          hunk.changes,
          contentLines.slice(contextStartIndex),
        );
        result.newContent.splice(
          start,
          hunkLines.oldLength,
          ...hunkLines.newLines,
        );
        result.indexOffset += hunkLines.newLines.length - hunkLines.oldLength;
        return result;
      },
      { newContent: [...contentLines], indexOffset: 0 },
    )
    .newContent.join("\n");
};

const findContextStartIndex = (contentLines, changes, oldStart) => {
  const context = changes
    .filter((line) => line.startsWith(" "))
    .map((line) => line.substring(1));
  const contextLength = context.length;
  let bestMatchIndex = oldStart - 1;
  let maxMatchCount = 0;

  for (let i = 0; i <= contentLines.length - contextLength; i++) {
    const matchCount = context.reduce(
      (count, line, j) => (contentLines[i + j] === line ? count + 1 : count),
      0,
    );
    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatchIndex = i;
    }
  }

  return bestMatchIndex;
};

const applyHunk = (changes, contextLines) => {
  return changes.reduce(
    (acc, line) => {
      if (line.startsWith("+")) {
        acc.newLines.push(line.substring(1));
      } else if (line.startsWith("-")) {
        acc.oldLength++;
      } else if (line.startsWith(" ")) {
        acc.newLines.push(line.substring(1));
        acc.oldLength++;
      }
      return acc;
    },
    { newLines: [], oldLength: 0 },
  );
};

export const applyParsedPatches = (filesContent, patches) => {
  return Object.entries(patches).reduce((acc, [filePath, patchInfo]) => {
    const originalContent = filesContent[filePath] || "";
    acc[filePath] = applyPatch(originalContent, patchInfo);
    return acc;
  }, {});
};
