import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "src");
const outputDir = "./public";

const propsMap = {};

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

const updatePropsMap = async (id) => {
  const module = await import(id);
  const { views } = module.default;

  Object.entries(views).forEach(([componentName, componentDetails]) => {
    if (componentDetails.props) {
      propsMap[componentName] = componentDetails.props;
    }
  });
};

const writeToFile = (map, filePath) => {
  const exports = `const props = ${JSON.stringify(map, null, 2)};
  export default props;`;

  try {
    fs.writeFileSync(filePath, exports, "utf8");
    console.log("props.mjs updated successfully!");
  } catch (error) {
    console.error("Error updating props.mjs:", error);
  }
};

const ServiceWorkerPlugin = () => ({
  name: "service-worker-plugin",

  buildStart() {
    copyFilesFromSrc();
  },

  async transform(code, id) {
    if (id.toString().includes("backend")) {
      const name = path.basename(id, path.extname(id));
      fs.copyFileSync(id, path.join(outputDir, name + ".mjs"));
    }

    if (id.endsWith(".package.mjs") || id.endsWith(".app.mjs")) {
      await updatePropsMap(id);
      writeToFile(propsMap, path.join(outputDir, "props.mjs"));
      return code;
    }
  },
});

export default ServiceWorkerPlugin;
