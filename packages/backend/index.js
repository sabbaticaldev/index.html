import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const controllersMap = {};
const modelsMap = {};
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const exportFile = (type, [name, code]) =>
  code.replace("export default", `const ${name}${type} = `);

const writeToFile = (type, map, filePath) => {
  const exports = `${Object.entries(map)
    .map((entry) => exportFile(type, entry))
    .join("\r\n")}
const ${type}s = { ${Object.keys(map)
  .map((name) => `${name}${type}`)
  .join(", ")} };
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
    const sourcePath = path.join(__dirname, "service-worker.mjs");
    const targetPath = path.join("./public", "service-worker.mjs");
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log("Service Worker copied successfully!");
    } catch (error) {
      console.error("Error copying the Service Worker:", error);
    }
  },

  transform(code, id) {
    if (id.includes("scaffold")) {
      const relativePath = path.relative(
        path.resolve(__dirname, "../../packages/scaffold/src"),
        id,
      );
      const outputPath = path.join("./public/scaffold", relativePath);
      const outputDir = path.dirname(outputPath);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, code, "utf8");
      console.log(`Copied scaffold file to ${outputPath}`);
    }
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
