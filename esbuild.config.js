import chokidar from "chokidar";
import * as esbuild from "esbuild";
import alias from "esbuild-plugin-alias";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function copyThemeFile() {
  const srcPath = path.join(__dirname, "libs/frontend/uno.global.js");
  const destPath = path.join(__dirname, "app/dist/uno.global.js");
  try {
    await fs.copyFile(srcPath, destPath);
    console.log("Theme file copied to dist folder.");
  } catch (err) {
    console.error("Error copying theme file:", err);
  }
}

const isWatchMode = process.argv.includes("--watch");
const watch = [];
const commonConfig = {
  bundle: true,
  sourcemap: true,
  minify: true,
  format: "esm",
  target: ["esnext"],
  plugins: [
    alias({
      frontend: path.resolve(__dirname, "libs/frontend/index.js"),
      helpers: path.resolve(__dirname, "libs/helpers/index.js"),
      backend: path.resolve(__dirname, "libs/backend/src"),
    }),
  ],
};

const buildTasks = [
  {
    ...commonConfig,
    entryPoints: ["libs/frontend/index.js"],
    outfile: "app/dist/frontend.js",
  },
  {
    ...commonConfig,
    entryPoints: ["libs/helpers/index.js"],
    outfile: "app/dist/helpers.js",
  },
  {
    ...commonConfig,
    entryPoints: ["libs/core/src/index.js"],
    outfile: "app/dist/brazuka.js",
    external: ["unocss"],
  },
  {
    ...commonConfig,
    format: "iife",
    target: ["es2017"],
    entryPoints: ["libs/backend/index.sw.js"],
    outfile: "app/dist/backend.sw.js",
  },
];

if (isWatchMode) {
  copyThemeFile();
  const wss = new WebSocketServer({ port: 4001 });
  wss.on("connection", () => {
    console.log("Client connected");
  });

  const ctx = await esbuild.context({
    entryPoints: ["./index.js"],
    outdir: "./app/dist/",
    bundle: false,
  });

  const server = await ctx.serve({
    servedir: "./app/",
    port: 4000,
  });

  console.log(`Server running at http://${server.host}:${server.port}`);

  buildTasks.forEach(async (task) => {
    const ctx = await esbuild.context(task);
    await ctx.watch();
    watch.push(ctx);
  });

  const watcher = chokidar.watch("./", {
    ignored: [/.baileys/,/node_modules/, /.git/, /\.map$/, /\.db$/, /app\/apps\/allfortraveler\/data/,/\.db-journal$/, /baileys_store\.json$/]
  });

  watcher.on("change", (path) => {
    console.log(`File ${path} has been changed. Refreshing...`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("refresh");
      }
    });
  });

  console.log("Watching...");
} else {
  copyThemeFile();
  buildTasks.forEach(async (task) => {
    await esbuild.build(task).catch(() => {
      process.exit(1);
    });
  });
}
