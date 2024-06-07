import { applyPatch, formatPatch, parsePatch } from "diff";
import fs from "fs";
import path from "path";

export const applyDiffToFileSystem = async (diffContent, config = {}) => {
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
    const fileName =
      patch.newFileName === "/dev/null" ? patch.oldFileName : patch.newFileName;

    const filePath =
      dirPath && !fileName.startsWith(dirPath)
        ? path.join(dirPath, fileName)
        : fileName;
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

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, newData, "utf8");
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
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

        let data;
        try {
          data = await fs.promises.readFile(filePath, "utf8");
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
            await fs.promises.writeFile(filePath, newData, "utf8");
            console.log(`File created: ${filePath}`);
            modifiedFiles.push(filePath);
            continue;
          } else {
            throw error;
          }
        }

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
            await fs.promises.writeFile(filePath, reverseUpdatedData, "utf8");
            console.log(`File updated with reverse patch: ${filePath}`);
            modifiedFiles.push(filePath);
          } else {
            console.error(`Failed to apply reverse patch for ${filePath}`);
          }
        } else {
          await fs.promises.writeFile(filePath, updatedData, "utf8");
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
    const resolvedFilePath = path.resolve(filePath);
    try {
      await fs.promises.unlink(resolvedFilePath);
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

export const importPatchContent = async (patchContent, config = {}) => {
  try {
    return await applyDiffToFileSystem(patchContent, config);
  } catch (error) {
    console.error("Error importing patch content:", error);
    throw error;
  }
};
