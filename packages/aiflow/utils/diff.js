/**
 * Utility functions for working with diffs and patches.
 * @module utils/diff
 */
import { applyPatch, formatPatch, parsePatch } from "diff";

import * as fileUtils from "../engines/node/fs.js";

/**
 * Applies a diff to the file system by creating, modifying, or deleting files based on the diff content.
 * @param {string} diffContent - The content of the diff.
 * @param {Object} [config={}] - Configuration options for applying the diff.
 * @returns {Promise<Array>} A promise that resolves to an array of modified file paths.
 */
export const importPatchContent = async (diffContent, config = {}) => {
  const { dirPath } = config;
  const patches = parsePatch(diffContent);
  const lines = diffContent.split("\n");
  const filesToDelete = [];
  const modifiedFiles = [];

  // Parse lines to find files to delete
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("+++ /dev/null")) {
      const filePath = lines[i - 1].substring(4).trim();
      filesToDelete.push(filePath);
      modifiedFiles.push(filePath);
    }
  }

  // Process patches
  for (const patch of patches) {
    const filePath =
      patch.newFileName === "/dev/null" ? patch.oldFileName : patch.newFileName;

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

      await fileUtils.createDir(fileUtils.dirname(filePath));
      await fileUtils.writeFile(filePath, newData);
      console.log(`File created: ${filePath}`);
      modifiedFiles.push(filePath);
    } else if (
      patch.newFileName === "/dev/null" &&
      patch.oldFileName !== "/dev/null"
    ) {
      // File deletion - This part is handled in the separate pass
      continue;
    } else {
      // File modification or creation if not exists
      try {
        await fileUtils.createDir(fileUtils.dirname(filePath));
        let data;
        try {
          data = await fileUtils.readFile(filePath);
        } catch (error) {
          if (error.code === "ENOENT") {
            // File does not exist, create new file with patch data
            const newData = patch.hunks
              .flatMap((hunk) =>
                hunk.lines
                  .filter((line) => line.startsWith("+"))
                  .map((line) => line.slice(1)),
              )
              .join("\n");
            await fileUtils.writeFile(filePath, newData);
            console.log(`File created: ${filePath}`);
            modifiedFiles.push(filePath);
            continue;
          } else {
            throw error;
          }
        }
        console.log({filePath, data, patch});
        const updatedData = applyPatch(data, patch, {
          context: 3,
          fuzzFactor: 2,
          ignoreWhitespace: true,
        });
        if (updatedData === false) {
          console.error(`Failed to apply patch for ${filePath}`);
          console.error(`Original Data:\n${data}`);
          console.error(`Patch:\n${JSON.stringify(patch, null, 2)}`);

          const reversePatch = formatPatch(patch);
          const reverseUpdatedData = applyPatch(
            data,
            reversePatch.split("\n").slice(2).join("\n"),
            {
              context: 3,
              fuzzFactor: 2,
              ignoreWhitespace: true,
            },
          );
          if (reverseUpdatedData !== false) {
            await fileUtils.writeFile(filePath, reverseUpdatedData);
            console.log(`File updated with reverse patch: ${filePath}`);
            modifiedFiles.push(filePath);
          } else {
            console.error(`Failed to apply reverse patch for ${filePath}`);
          }
        } else {
          await fileUtils.writeFile(filePath, updatedData);
          console.log(`File updated: ${filePath}`);
          modifiedFiles.push(filePath);
        }
      } catch (error) {
        console.error(`Error updating file ${filePath}: ${error}`, { error });
      }
    }
  }

  // Handle file deletions
  for (const filePath of filesToDelete) {
    const resolvedFilePath = fileUtils.resolvePath(filePath);
    try {
      await fileUtils.unlink(resolvedFilePath);
      console.log(`File deleted: ${resolvedFilePath}`);
    } catch (error) {
      console.error(`Error deleting file ${resolvedFilePath}: ${error}`);
    }
  }
  return modifiedFiles;
};

/**
 * Imports patch files by reading the patch file, applying the patches, and writing the updated content.
 * @param {string} input - The path to the patch file.
 * @returns {Promise<Array>} A promise that resolves to an array of modified file paths.
 */
/**
 * Imports patch files by reading the patch file, applying the patches, and writing the updated content.
 * @param {string} input - The path to the patch file.
 */
export const importPatchFile = async (input) => {
  try {
    const patchContent = await fileUtils.readFile(input);
    return await importPatchContent(patchContent);
  } catch (error) {
    console.error("Error importing patch files:", error);
    throw error;
  }
};
