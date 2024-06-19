import chokidar from "chokidar";
import * as esbuild from "esbuild";
import alias from "esbuild-plugin-alias";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWatchMode = process.argv.includes("--watch");
const watch = [];
const commonConfig = {
  bundle: true,
  sourcemap: true,
  minify: false,
  format: "esm",
  target: ["esnext"],
  plugins: [
    alias({
      frontend: path.resolve(__dirname, "libs/frontend/index.js"),
      backend: path.resolve(__dirname, "libs/backend/index.js"),
    }),
  ],
};
const OUTPUT_PATH = "packages/index-html/dist/";
const buildTasks = [
  {
    ...commonConfig,
    entryPoints: ["libs/frontend/index.js"],
    outfile: OUTPUT_PATH + "frontend.js",
  },
  {
    ...commonConfig,
    entryPoints: ["libs/backend/index.sw.js"],
    outfile: OUTPUT_PATH + "backend.sw.js",
  },
  {
    ...commonConfig,
    entryPoints: ["libs/backend/index.js"],
    outfile: OUTPUT_PATH + "backend.js",
  },
];

if (isWatchMode) {
  const wss = new WebSocketServer({ port: 4001 });
  wss.on("connection", () => {
    console.log("Client connected");
  });

  buildTasks.forEach(async (task) => {
    const ctx = await esbuild.context(task);
    await ctx.watch();
    watch.push(ctx);
  });

  const watcher = chokidar.watch("./", {
    ignored: [
      /.baileys/,
      /node_modules/,
      /.git/,
      /\.map$/,
      /\.db$/,
      /app\/apps\/allfortraveler\/data/,
      /\.db-journal$/,
      /baileys_store\.json$/,
    ],
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
  buildTasks.forEach(async (task) => {
    await esbuild.build(task).catch(() => {
      process.exit(1);
    });
  });
}
