import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "src");
const outputDir = "./public";

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

const ServiceWorkerPlugin = () => ({
  name: "service-worker-plugin",

  buildStart() {
    copyFilesFromSrc();
  },

  async transform(code, id) {
    console.log(id.toString());
    if (id.toString().includes("backend")) {
      const name = path.basename(id, path.extname(id));
      console.log(path.basename(id));
      fs.copyFileSync(id, path.join(outputDir, name + ".mjs"));
    }
  },
});

export default ServiceWorkerPlugin;
