import { applyPatch, createTwoFilesPatch, parsePatch } from "diff";
import fs from "fs";
import path from "path";

const applyDiffToFileSystem = async (diffContent) => {
  const patches = parsePatch(diffContent);
  const lines = diffContent.split("\n");
  const filesToDelete = [];

  // Parse lines to find files to delete
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("+++ /dev/null")) {
      const filePath = lines[i - 1].substring(4).trim();
      filesToDelete.push(filePath);
    }
  }

  // Process patches
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

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, newData, "utf8");
      console.log(`File created: ${filePath}`);
    } else if (
      patch.newFileName === "/dev/null" &&
      patch.oldFileName !== "/dev/null"
    ) {
      // File deletion - This part is handled in the separate pass
      continue;
    } else {
      // File modification
      try {
        const data = await fs.promises.readFile(filePath, "utf8");
        const updatedData = applyPatch(data, patch, {
          context: 3,
          fuzzFactor: 2,
          ignoreWhitespace: true,
        });
        if (updatedData === false) {
          console.error(`Failed to apply patch for ${filePath}`);
          console.error(`Original Data:\n${data}`);
          console.error(`Patch:\n${JSON.stringify(patch, null, 2)}`);

          // Attempt to create and apply a reverse patch
          const reversePatch = createTwoFilesPatch(
            patch.newFileName,
            patch.oldFileName,
            "",
            data,
            patch.newHeader,
            patch.oldHeader,
          );
          const reverseUpdatedData = applyPatch(data, reversePatch);
          if (reverseUpdatedData !== false) {
            await fs.promises.writeFile(filePath, reverseUpdatedData, "utf8");
            console.log(`File updated with reverse patch: ${filePath}`);
          }
        } else {
          await fs.promises.writeFile(filePath, updatedData, "utf8");
          console.log(`File updated: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error updating file ${filePath}: ${error}`);
      }
    }
  }

  // Handle file deletions
  for (const filePath of filesToDelete) {
    const resolvedFilePath = path.resolve(filePath);
    try {
      await fs.promises.unlink(resolvedFilePath);
      console.log(`File deleted: ${resolvedFilePath}`);
    } catch (error) {
      console.error(`Error deleting file ${resolvedFilePath}: ${error}`);
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
