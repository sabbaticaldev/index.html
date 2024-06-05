import * as diff from "diff";
import * as fs from "fs";
export const parsePatch = (patchContent) => {
  const patches = diff.parsePatch(patchContent);
  const filePatches = {};

  patches.forEach((patch) => {
    const { newFileName, oldFileName, hunks } = patch;
    const content = hunks.map((hunk) => hunk.lines.join("\n")).join("\n");
    const patchString = diff.createTwoFilesPatch(
      oldFileName,
      newFileName,
      "",
      content,
    );

    if (newFileName === "/dev/null") {
      // File deletion
      filePatches[oldFileName] = {
        patchContent: patchString,
        isDeletion: true,
      };
    } else if (oldFileName === "/dev/null") {
      // File addition
      filePatches[newFileName] = { content, isAddition: true };
    } else {
      // File modification
      if (!filePatches[newFileName]) {
        filePatches[newFileName] = { patchContent: "", isModification: true };
      }
      filePatches[newFileName].patchContent += patchString;
    }
  });

  return filePatches;
};

export const applyParsedPatches = (originalContents, filePatches) => {
  const updatedContents = {};

  Object.keys(filePatches).forEach((filePath) => {
    const { patchContent, content, isDeletion, isAddition } =
      filePatches[filePath];

    if (isDeletion) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filePath}`);
      }
      return;
    }

    if (isAddition) {
      updatedContents[filePath] = content;
      return;
    }

    const originalContent = originalContents[filePath] || "";
    const patches = diff.parsePatch(patchContent);
    console.log({ patches });
    const updatedContent = diff.applyPatch(originalContent, patches);
    //const updatedContent = patches.reduce(
    //  (content, patch) => diff.applyPatch(originalContent, patches),
    //  originalContent,
    //);

    if (updatedContent === false) {
      console.error(`Failed to apply patch for ${filePath}`);
    } else {
      updatedContents[filePath] = updatedContent;
    }
  });

  return updatedContents;
};
