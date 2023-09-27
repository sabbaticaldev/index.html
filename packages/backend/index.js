import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "src");
const outputDir = "./public";

const modelsMap = {};

const copyFilesFromSrc = () => {
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    const sourcePath = path.join(srcDir, file);
    const targetPath = path.join(outputDir, file);
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`${file} copied successfully!`);
    } catch (error) {
      console.error(`Error copying ${file}:`, error);
    }
  });
};

const exportFile = (type, [name, code]) =>
  code.replace("export default", `const ${name} = `);

const writeToFile = (type, map, filePath) => {
  const exports = `${Object.entries(map)
    .map((entry) => exportFile(type, entry))
    .join("\r\n")}
    const ${type}s = { ${Object.keys(map).join(", ")} };
    export default ${type}s;`;

  try {
    fs.writeFileSync(filePath, exports, "utf8");
    console.log(`${type}s.mjs updated successfully!`);
  } catch (error) {
    console.error(`Error updating ${type}s.mjs:`, error);
  }
};

const ServiceWorkerPlugin = () => ({
  name: "service-worker-plugin",

  buildStart() {
    copyFilesFromSrc();
  },

  transform(code, id) {
    if (id.toString().includes("backend")) {
      const name = path.basename(id, path.extname(id));
      fs.copyFileSync(id, path.join(outputDir, name + ".mjs"));
    }

    if (id.endsWith(".model.js") || id.endsWith(".model.ts")) {
      const name = path.basename(id, path.extname(id)).replace(".model", "");
      modelsMap[name] = code;
      writeToFile("Model", modelsMap, path.join(outputDir, "models.mjs"));
      return code;
    }
  },
});

export default ServiceWorkerPlugin;
