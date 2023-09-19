import fs from "fs";
import path from "path";

let controllerEndpoints = {};
console.log("testando");
export default function ServiceWorkerPlugin(userOptions = {}) {
  return {
    name: "vite-bootstrapp",
    writeBundle() {
      // Path to the service-worker.mjs in the plugin package
      const serviceWorkerPath = path.join(__dirname, "service-worker.mjs");

      // Path to where the service-worker.mjs should be written in the consuming application
      const serviceWorkerOutputPath = path.join(
        process.cwd(),
        "public",
        "service-worker.mjs",
      );

      // Read the original service worker file
      let serviceWorkerCode = fs.readFileSync(serviceWorkerPath, "utf-8");

      // Construct the combined endpoint object code
      let combinedEndpoints = Object.values(controllerEndpoints).join(",");
      const apiCode = `const api = {${combinedEndpoints}};`;

      // Inject the combined endpoints at the top of the service worker
      serviceWorkerCode = `${apiCode}\n\n${serviceWorkerCode}`;
      console.log({ controllerEndpoints, serviceWorkerCode });
      // Write the modified service-worker.js
      fs.writeFileSync(serviceWorkerOutputPath, serviceWorkerCode);
    },

    transform(code, id) {
      if (id.endsWith(".controller.js") || id.endsWith(".controller.ts")) {
        // Extract endpoints from the module
        const matched = code.match(/endpoints\s*=\s*{([\s\S]*?)}/);
        if (matched) {
          controllerEndpoints[id] = matched[1]; // store the inside of the endpoint object
        }
        return code;
      }
    },
  };
}
