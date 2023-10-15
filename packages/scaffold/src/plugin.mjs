import fs from "fs";
import path from "path";

const outputDir = "./public";

const VitePlugin = () => ({
  name: "service-worker-plugin",

  async transform(code, id) {
    if (id.toString().includes("backend")) {
      const name = path.basename(id, path.extname(id));
      fs.copyFileSync(id, path.join(outputDir, name + ".mjs"));
    }
  }
});

export default VitePlugin;
