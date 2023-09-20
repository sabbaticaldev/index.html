import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let controllersMap = {};

const exportController = ([name, code]) =>
  code.replace("export default", `const ${name}Controller = `);

const ServiceWorkerPlugin = () => ({
  name: "service-worker-plugin",

  // This hook is called when the Rollup build starts
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

  // This hook is called for every file in the build
  transform(code, id) {
    if (id.endsWith(".controller.js") || id.endsWith(".controller.ts")) {
      const name = path
        .basename(id, path.extname(id))
        .replace(".controller", "");
      controllersMap[name] = code;

      // Write the controllers.js file immediately after processing a controller file
      const controllerFilePath = path.join("./public", "controllers.mjs");
      const controllerExports = `${Object.entries(controllersMap)
        .map(exportController)
        .join("\r\n")}
const controllers = { ${Object.keys(controllersMap)
    .map((controller) => controller + "Controller ")
    .join(", ")} };
export default controllers;`;

      try {
        fs.writeFileSync(controllerFilePath, controllerExports, "utf8");
        console.log("controllers.js updated successfully!");
      } catch (error) {
        console.error("Error updating controllers.js:", error);
      }

      return code;
    }
  },
});

export default ServiceWorkerPlugin;
