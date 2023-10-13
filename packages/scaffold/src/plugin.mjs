import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const srcDir = path.dirname(fileURLToPath(import.meta.url));
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

const VitePlugin = () => ({
  name: "service-worker-plugin",

  buildStart() {
    copyFilesFromSrc();
  },

  async transform(code, id) {
    if (id.toString().includes("backend")) {
      const name = path.basename(id, path.extname(id));
      fs.copyFileSync(id, path.join(outputDir, name + ".mjs"));
    }
  }
});

export default VitePlugin;