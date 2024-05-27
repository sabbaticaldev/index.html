import fs from "fs";
import path from "path";

import { parseXML } from "../utils.js";

export const importXmlFiles = async (xmlFilePath) => {
  try {
    const xmlContent = await fs.promises.readFile(xmlFilePath, "utf8");
    const parsedXml = parseXML(xmlContent);
    console.log({ parsedXml });
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
