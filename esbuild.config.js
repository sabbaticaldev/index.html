import chokidar from "chokidar";
import * as esbuild from "esbuild";
import alias from "esbuild-plugin-alias";
import fs from "fs";
import http from "http";
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
      helpers: path.resolve(__dirname, "libs/helpers/index.js"),
      backend: path.resolve(__dirname, "libs/backend/index.js"),
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
    entryPoints: ["libs/core/index.js"],
    outfile: "app/dist/core.js",
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
  const wss = new WebSocketServer({ port: 4001 });
  wss.on("connection", () => {
    console.log("Client connected");
  });

  const ctx = await esbuild.context({
    entryPoints: ["./index.js"],
    outdir: "./app/dist/",
    bundle: false,
  });

  buildTasks.forEach(async (task) => {
    const ctx = await esbuild.context(task);
    await ctx.watch();
    watch.push(ctx);
  });

  const server = http.createServer((req, res) => {
    let filePath = path.join(
      __dirname,
      "app",
      decodeURIComponent(req.url === "/" ? "index.html" : req.url),
    );
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".md": "text/markdown",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
    };

    fs.readFile(filePath, (err, data) => {
      console.log({ filePath });
      if (err) {
        fs.readFile(path.join(__dirname, "app", "index.html"), (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end("404 Not Found");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          }
        });
      } else {
        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "application/octet-stream",
        });
        res.end(data);
      }
    });
  });

  server.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
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
