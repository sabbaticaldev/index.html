import * as diff from "diff";

export const parsePatch = (patchContent) => {
  const filePatches = {};
  // Split the content by newlines and then process line by line.
  const lines = patchContent.split("\n");
  let currentFilePatch = [];
  let currentFilePath = "";

  lines.forEach((line) => {
    if (line.startsWith("---")) {
      // Reset current file patch when we encounter a new file section
      if (currentFilePath && currentFilePatch.length > 0) {
        filePatches[currentFilePath] = currentFilePatch.join("\n");
      }
      currentFilePatch = [];
      currentFilePath = ""; // Clear the current file path at the start of a new patch section
    } else if (line.startsWith("+++")) {
      // Extract the file path from the modified file header, unless it's /dev/null
      if (!line.includes("/dev/null")) {
        currentFilePath = line.replace("+++", "").trim();
      }
    } else {
      currentFilePatch.push(line);
    }
  });

  // Add the last parsed file patch to the dictionary
  if (currentFilePath && currentFilePatch.length > 0) {
    filePatches[currentFilePath] = currentFilePatch.join("\n");
  }

  return filePatches;
};

export const applyParsedPatches = (originalContents, filePatches) => {
  const updatedContents = {};

  Object.keys(filePatches).forEach((filePath) => {
    const patchContent = filePatches[filePath];
    const originalContent = originalContents[filePath] || "";
    let updatedContent;

    if (!originalContent) {
      updatedContent = patchContent
        .split("\n")
        .slice(1)
        .map((line) => line.substring(1))
        .join("\n");
    } else {
      // Apply the patch normally
      const patches = diff.parsePatch(patchContent);
      updatedContent = diff.applyPatch(originalContent, patches);
      if (updatedContent === false) {
        console.log({ patches, [filePath]: patchContent });
        console.error(`Failed to apply patch for ${filePath}`);
      }
    }

    if (updatedContent) {
      updatedContents[filePath] = updatedContent;
    }
  });

  return updatedContents;
};
