import chokidar from "chokidar";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const uixDir = path.join(__dirname, "../uix");
const distDir = path.join(__dirname, "dist");

const server = http.createServer((req, res) => {
  let filePath;

  if (req.url.startsWith("/uix/")) {
    filePath = path.join(uixDir, req.url.substring(5));
  } else if (req.url.startsWith("/dist/")) {
    filePath = path.join(distDir, req.url.substring(6));
  } else {
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[/\\])+/, "");
    filePath = path.join(
      rootDir,
      safeSuffix === "/" ? "index.html" : safeSuffix,
    );
  }

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

  console.log(`Request for ${filePath}`);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      fs.readFile(path.join(rootDir, "index.html"), (err, data) => {
        if (err) {
          console.error("Error reading fallback index.html", err);
          res.writeHead(404);
          res.end("404 Not Found");
        } else {
          console.warn(
            `File not found: ${filePath}. Serving index.html instead.`,
          );
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else {
      console.log(`Serving ${filePath}`);
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
      res.end(data);
    }
  });
});

const wss = new WebSocketServer({ port: 4001 });
wss.on("connection", () => {
  console.log("Client connected");
});

server.listen(4000, () => {
  console.log(
    `Server running at http://localhost:4000, serving directory: ${rootDir}`,
  );
});

const watcher = chokidar.watch([rootDir, uixDir, distDir], {
  ignored: [
    /.baileys/,
    /node_modules/,
    /.git/,
    /\.map$/,
    /\.db$/,
    /\.db-journal$/,
    /baileys_store\.json$/,
  ],
});

watcher.on("change", (filePath) => {
  console.log(`File ${filePath} has been changed. Refreshing...`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("refresh");
    }
  });
});

console.log("Watching...");
