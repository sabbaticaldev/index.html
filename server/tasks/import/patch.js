import * as fs from "fs";
import path from "path";

import { applyParsedPatches, parsePatch } from "../../utils/patch.js";
/**
 * Imports patch files by reading the patch file, applying the patches, and writing the updated content.
 * @param {string} input - The path to the patch file.
 */
export const importPatchFile = async (input) => {
  try {
    const patchContent = await fs.promises.readFile(input, "utf8");
    return await importPatchContent(patchContent);
  } catch (error) {
    console.error("Error importing patch files:", error);
    throw error;
  }
};

export const importPatchContent = async (patchContent) => {
  try {
    const filePatches = parsePatch(patchContent);
    const originalContents = {};
    const modifiedFiles = [];
    console.log({ filePatches });
    for (const filePath of Object.keys(filePatches)) {
      const { isDeletion, isAddition } = filePatches[filePath];
      const fullPath = path.join(process.cwd(), filePath);

      if (isDeletion) {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`File deleted: ${fullPath}`);
        }
        continue;
      }

      if (!isAddition) {
        try {
          await fs.promises.access(fullPath);
          originalContents[filePath] = await fs.promises.readFile(
            fullPath,
            "utf8",
          );
        } catch (err) {
          console.warn(`File not found: ${fullPath}. Creating a new file.`);
          originalContents[filePath] = "";
        }
      }
    }

    const updatedFiles = applyParsedPatches(originalContents, filePatches);
    for (const filePath in updatedFiles) {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.promises.writeFile(fullPath, updatedFiles[filePath], "utf8");
      console.log(`File imported: ${fullPath}`);
      modifiedFiles.push(fullPath);
    }

    console.log({ modifiedFiles });
    return modifiedFiles;
  } catch (error) {
    console.error("Error importing patch content:", error);
    throw error;
  }
};
