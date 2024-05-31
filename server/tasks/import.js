import fs from "fs";
import path from "path";

import { parseXML } from "../utils.js";
import { applyPatch, parsePatch } from "../utils/patch.js";

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
    const modifiedFiles = [];

    for (const [filepath, patchLines] of Object.entries(filePatches)) {
      const fullPath = path.join(process.cwd(), filepath);
      let originalContent = "";

      try {
        originalContent = await fs.promises.readFile(fullPath, "utf8");
      } catch (err) {
        console.warn(`File not found: ${fullPath}. Creating a new file.`);
      }

      const newContent = applyPatch(originalContent, patchLines);
      const outputPath = path.join(process.cwd(), filepath);

      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, newContent, "utf8");
      console.log(`File imported: ${outputPath}`);
      modifiedFiles.push(outputPath);
    }

    return modifiedFiles;
  } catch (error) {
    console.error("Error importing patch content:", error);
    throw error;
  }
};
