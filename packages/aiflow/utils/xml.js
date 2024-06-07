import * as fs from "fs";
import path from "path";
import { parseString } from "xml2js";
export const parseXML = (xml) => {
  let result;
  parseString(
    xml,
    { explicitArray: false, mergeAttrs: true, explicitRoot: false },
    (err, parsedResult) => {
      if (err) {
        console.log({ err });
        throw new Error("Failed to parse XML");
      }

      // Transform <item> arrays back into proper arrays
      const transform = (obj) => {
        if (typeof obj !== "object" || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(transform);
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (key === "item" && Array.isArray(value)) {
            acc[key] = value.map(transform);
          } else if (typeof value === "object" && value.item) {
            acc[key] = Array.isArray(value.item)
              ? value.item.map(transform)
              : [transform(value.item)];
          } else {
            acc[key] = transform(value);
          }
          return acc;
        }, {});
      };

      result = transform(parsedResult);
    },
  );
  return result;
};

export const generateXMLFormat = (exampleOutput, rootElement = "root") => {
  const needsCDATA = (str) => {
    const pattern = /[^\\w\\s.,-]/; // Regex to check for non-alphanumeric characters and some allowed symbols
    return pattern.test(str);
  };

  const escapeXML = (str) => {
    if (typeof str === "string" && needsCDATA(str)) {
      return `<![CDATA[${str}]]>`;
    }
    return str;
  };

  const convertToXML = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return escapeXML(obj);
    }

    return Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `<${key}>${value
            .map((item) => `<item>${convertToXML(item)}</item>`)
            .join("")}</${key}>`;
        } else if (typeof value === "object") {
          return `<${key}>${convertToXML(value)}</${key}>`;
        } else {
          return `<${key}>${escapeXML(value)}</${key}>`;
        }
      })
      .join("");
  };

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<${rootElement}>
  ${convertToXML(exampleOutput)}
</${rootElement}>
`;
};

export const importXmlFiles = async ({ input }) => {
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
