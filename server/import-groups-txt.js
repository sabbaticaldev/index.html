import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Function to normalize tags: replace accented characters, convert to lowercase, replace spaces with hyphens
function normalizeTag(tag) {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the file and process the contents
fs.readFile(path.join(__dirname, "../data/input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const lines = data.split(/\r?\n/); // Split by new line, compatible with Windows (\r\n) and Unix (\n)
  const groups = [];

  lines.forEach(line => {
    if (line.trim()) { // Ignore empty lines
      const parts = line.split("||");
      if (parts.length === 3) {
        const name = parts[0].trim();
        const url = parts[1].trim();
        const tagsPart = parts[2].split(";")[0].trim(); // Remove trailing semicolon and trim
        const tags = tagsPart.split(",").map(tag => normalizeTag(tag.trim())); // Normalize each tag

        groups.push({
          name,
          url,
          tags
        });
      }
    }
  });

  console.log(JSON.stringify(groups, null, 2));
});
