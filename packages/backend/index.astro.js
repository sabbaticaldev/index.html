import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let controllerEndpoints = {};
let controllersMap = {};

const ServiceWorkerIntegration = () => ({
  name: "service-worker-integration",

  hooks: {
    "astro:config:done": ({ logger }) => {
      const sourcePath = path.join(__dirname, "service-worker.mjs");
      const targetPath = path.join("./public", "service-worker.mjs");

      try {
        fs.copyFileSync(sourcePath, targetPath);
        logger.info("Service Worker copied successfully!");
      } catch (error) {
        logger.error("Error copying the Service Worker:", error);
      }

      const controllerFilePath = path.join("./public", "controllers.js");
      const controllerExports = Object.entries(controllersMap)
        .map(([name, content]) => `export const ${name} = ${content};`)
        .join("\n");

      try {
        fs.writeFileSync(controllerFilePath, controllerExports, "utf8");
        logger.info("controllers.js generated successfully!");
      } catch (error) {
        logger.error("Error generating controllers.js:", error);
      }
    },

    transform(code, id) {
      if (id.endsWith(".controller.js") || id.endsWith(".controller.ts")) {
        const matched = code.match(/endpoints\s*=\s*{([\s\S]*?)}/);
        if (matched) {
          controllerEndpoints[id] = matched[1];
        }

        const name = path
          .basename(id, path.extname(id))
          .replace(".controller", "");
        controllersMap[name] = code;
        return code;
      }
    },
  },
});

export default ServiceWorkerIntegration;
