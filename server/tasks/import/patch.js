import { applyPatch, parsePatch } from "diff";
import fs from "fs";
import path from "path";

const applyDiffToFileSystem = async (diffContent) => {
  const patches = parsePatch(diffContent);

  for (const patch of patches) {
    const filePath = path.resolve(
      patch.newFileName === "/dev/null" ? patch.oldFileName : patch.newFileName,
    );

    if (
      patch.oldFileName === "/dev/null" &&
      patch.newFileName !== "/dev/null"
    ) {
      // File creation
      const newData = patch.hunks
        .flatMap((hunk) =>
          hunk.lines
            .filter((line) => line.startsWith("+"))
            .map((line) => line.slice(1)),
        )
        .join("\n");
      await fs.promises.writeFile(filePath, newData, "utf8");
      console.log(`File created: ${filePath}`);
    } else if (
      patch.newFileName === "/dev/null" &&
      patch.oldFileName !== "/dev/null"
    ) {
      // File deletion
      await fs.promises.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } else {
      // File modification
      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        const updatedData = applyPatch(data, patch);
        console.log({
          updatedData,
          data,
          patch,
          jsonPatch: JSON.stringify(patch),
        });
        if (updatedData) {
          await fs.promises.writeFile(filePath, updatedData, "utf8");
          console.log(`File updated: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error updating file ${filePath}: ${error}`);
      }
    }
  }
};

/**
 * Imports patch files by reading the patch file, applying the patches, and writing the updated content.
 * @param {string} input - The path to the patch file.
 */
export const importPatchFile = async (input) => {
  try {
    const patchContent = await fs.promises.readFile(input, "utf8");
    return await applyDiffToFileSystem(patchContent);
  } catch (error) {
    console.error("Error importing patch files:", error);
    throw error;
  }
};

export const importPatchContent = async (patchContent) => {
  try {
    applyDiffToFileSystem(patchContent);
  } catch (error) {
    console.error("Error importing patch content:", error);
    throw error;
  }
};
