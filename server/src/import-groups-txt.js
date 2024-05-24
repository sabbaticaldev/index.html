import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const normalizeTag = tag => tag
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\s+/g, "-");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.readFile(path.join(__dirname, "./data/input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const groups = data.split(/\r?\n/)
    .filter(line => line.trim())
    .map(line => {
      const [name, url, tagsPart] = line.split("||").map(part => part.trim());
      const tags = tagsPart.split(";")[0].split(",").map(tag => normalizeTag(tag.trim()));
      return { name, url, tags };
    });

  console.log(JSON.stringify(groups, null, 2));
});
