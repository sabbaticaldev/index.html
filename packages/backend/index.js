import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const controllersMap = {};
const modelsMap = {};
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const copyFiles = (filesToCopy) =>
  filesToCopy.forEach((file) => {
    const sourcePath = path.join(__dirname, file.source);
    const targetPath = path.join("./public", file.target);
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`${file.source} copied successfully to ${file.target}!`);
    } catch (error) {
      console.error(`Error copying ${file.source} to ${file.target}:`, error);
    }
  });

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
    const filesToCopy = [
      { source: "service-worker.mjs", target: "service-worker.mjs" },
      { source: "reactive-controller.mjs", target: "reactive-controller.mjs" },
      { source: "reactive-record.mjs", target: "reactive-record.mjs" },
      { source: "indexeddb.mjs", target: "indexeddb.mjs" },
    ];
    copyFiles(filesToCopy);
  },

  transform(code, id) {
    if (id.endsWith(".controller.js") || id.endsWith(".controller.ts")) {
      const name = path
        .basename(id, path.extname(id))
        .replace(".controller", "");
      controllersMap[name] = code;
      writeToFile(
        "Controller",
        controllersMap,
        path.join("./public", "controllers.mjs"),
      );
      return code;
    }

    if (id.endsWith(".model.js") || id.endsWith(".model.ts")) {
      const name = path.basename(id, path.extname(id)).replace(".model", "");
      modelsMap[name] = code;
      writeToFile("Model", modelsMap, path.join("./public", "models.mjs"));
      return code;
    }
  },
});

export default ServiceWorkerPlugin;
