// build.js
import { build } from "esbuild";

build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "dist/index.js",
  format: "esm", 
  sourcemap: true, 
  external: ["unocss"],
}).catch(() => process.exit(1));