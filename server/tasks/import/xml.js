import * as fs from "fs";
import path from "path";

import { parseXML } from "../../utils/xml.js";

export const importXmlFiles = async (input) => {
  try {
    const xmlContent = await fs.readFile(input, "utf8");
    const parsedXml = parseXML(xmlContent);
    for (const file of parsedXml) {
      const { filePath, content } = file;
      const outputPath = path.join(process.cwd(), filePath);

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, content, "utf8");
      console.log(`File imported: ${outputPath}`);
    }
  } catch (error) {
    console.error("Error importing XML files:", error);
    throw error;
  }
};
