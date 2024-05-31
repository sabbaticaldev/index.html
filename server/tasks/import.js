import fs from "fs";
import path from "path";

import { applyParsedPatches, parsePatch } from "../utils/patch.js";
import { parseXML } from "../utils/xml.js";

export const importXmlFiles = async (input) => {
  try {
    const xmlContent = await fs.promises.readFile(input, "utf8");
    const parsedXml = parseXML(xmlContent);
    for (const file of parsedXml) {
      const { filepath, content } = file;
      const outputPath = path.join(process.cwd(), filepath);

      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, content, "utf8");
      console.log(`File imported: ${outputPath}`);
    }
  } catch (error) {
    console.error("Error importing XML files:", error);
    throw error;
  }
};

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

/**
 * Imports patch content by applying the patches and writing the updated content.
 * @param {string} patchContent - The content of the patch file.
 * @returns {Promise<string[]>} - An array of file paths of the files that were modified.
 */
export const importPatchContent = async (patchContent) => {
  try {
    const filePatches = parsePatch(patchContent);
    const originalContents = {};
    const modifiedFiles = [];

    console.log({ filePatches, originalContents });

    for (const oldFilePath of Object.keys(filePatches)) {
      const fullPath = path.join(process.cwd(), oldFilePath);
      try {
        originalContents[oldFilePath] = await fs.promises.readFile(
          fullPath,
          "utf8",
        );
      } catch (err) {
        console.warn(`File not found: ${fullPath}. Creating a new file.`);
        originalContents[oldFilePath] = "";
      }
    }

    const updatedFiles = applyParsedPatches(originalContents, filePatches);

    for (const [oldFilePath, { newFilePath }] of Object.entries(filePatches)) {
      const outputPath = path.join(process.cwd(), newFilePath || oldFilePath);
      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(
        outputPath,
        updatedFiles[newFilePath || oldFilePath],
        "utf8",
      );
      console.log(`File imported: ${outputPath}`);
      modifiedFiles.push(outputPath);

      // If the file was renamed, remove the old file
      if (newFilePath && newFilePath !== oldFilePath) {
        const oldFullPath = path.join(process.cwd(), oldFilePath);
        await fs.promises.unlink(oldFullPath);
        console.log(`File renamed from ${oldFullPath} to ${outputPath}`);
      }
    }

    return modifiedFiles;
  } catch (error) {
    console.error("Error importing patch content:", error);
    throw error;
  }
};
