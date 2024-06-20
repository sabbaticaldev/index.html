import chokidar from "chokidar";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from "ws";

import { generateCertificates } from "./ssl.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const useHttps = args.includes("--https");
const hostArgIndex = args.indexOf("--host");
const host = hostArgIndex !== -1 ? args[hostArgIndex + 1] : "localhost";
const port = process.env.SERVER_PORT || 4000;
const debugPort = parseInt(port) + 1;

const rootDir = args.find((arg) => !arg.startsWith("--")) || process.cwd();
const uixDir = path.join(__dirname, "../uix");
const frontendDir = path.join(__dirname, "../frontend");
const backendDir = path.join(__dirname, "../backend");
const serviceWorkerPath = path.join(__dirname, "../backend/service-worker.js");

let server;
let serverOptions;

if (useHttps) {
  const { keyPath, certPath } = generateCertificates(rootDir);

  console.log(`Using SSL key at: ${keyPath}`);
  console.log(`Using SSL certificate at: ${certPath}`);

  serverOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  server = https.createServer(serverOptions, requestHandler);
} else {
  server = http.createServer(requestHandler);
}

function requestHandler(req, res) {
  let filePath;

  if (req.url.startsWith("/uix/")) {
    filePath = path.join(uixDir, req.url.substring(5));
  } else if (req.url.startsWith("/frontend/")) {
    filePath = path.join(frontendDir, req.url.substring(10));
  } else if (req.url.startsWith("/backend/")) {
    filePath = path.join(backendDir, req.url.substring(9));
  } else if (req.url.endsWith("/service-worker.js")) {
    filePath = serviceWorkerPath;
  } else {
    const safeSuffix = path.normalize(req.url).replace(/^(\.\.[/\\])+/, "");
    filePath = path.join(
      rootDir,
      safeSuffix === "/" ? "index.html" : safeSuffix,
    );

    // If the requested file is /models.js and it doesn't exist, try /backend/models.js
    if (req.url === "/models.js") {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log("/models.js not found, trying /backend/models.js");
          filePath = path.join(backendDir, "models.js");
          serveFile(filePath, res);
        } else {
          serveFile(filePath, res);
        }
      });
      return; // Exit early to avoid reading the file immediately
    }
  }

  serveFile(filePath, res);
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
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
}

const wss = new WebSocketServer({ port: debugPort });

wss.on("connection", () => {
  console.log("Client connected");
});

server.listen(port, host, () => {
  console.log(
    `Server running at ${
      useHttps ? "https" : "http"
    }://${host}:${port}, serving directory: ${rootDir}`,
  );
});

const watcher = chokidar.watch([rootDir, uixDir, frontendDir, backendDir], {
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
