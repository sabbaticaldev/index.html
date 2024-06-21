import chokidar from "chokidar";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket, { WebSocketServer } from "ws";

import { createHttpsServer } from "./ssl.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const useHttps = args.includes("--https");
const hostArgIndex = args.indexOf("--host");
const host = hostArgIndex !== -1 ? args[hostArgIndex + 1] : "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 1313;
const DEBUG_PORT = parseInt(SERVER_PORT) + 1;

const rootDir = args.find((arg) => !arg.startsWith("--")) || process.cwd();
const uixDir = path.join(__dirname, "../uix");
const frontendDir = path.join(__dirname, "../frontend");
const backendDir = path.join(__dirname, "../backend");
const adminDir = path.join(__dirname, "../admin");

const urlMappings = {
  "/uix/": uixDir,
  "/frontend/": frontendDir,
  "/backend/": backendDir,
  "/admin/": adminDir,
};

const specialCases = [
  { url: "/models.js", fallbackDir: backendDir },
  { url: "/favicon.ico", fallbackDir: frontendDir },
  {
    url: "/service-worker.js",
    fallbackPath: path.join(__dirname, "../backend/service-worker.js"),
  },
  { url: "/admin.html", redirectTo: "/admin/index.html" },
];

let server;

if (useHttps) {
  server = createHttpsServer(rootDir, requestHandler);
} else {
  server = http.createServer(requestHandler);
}

function requestHandler(req, res) {
  const safeSuffix = path.normalize(req.url).replace(/^(\.\.[/\\])+/, "");
  const matchedCase = specialCases.find((sc) => req.url === sc.url);

  if (matchedCase) {
    if (matchedCase.redirectTo) {
      const redirectPath = path.join(adminDir, "index.html");
      serveFile(redirectPath, res);
      return;
    }

    let filePath = path.join(rootDir, safeSuffix);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        if (matchedCase.fallbackDir) {
          console.log(
            `${req.url} not found, trying ${matchedCase.fallbackDir}${req.url}`,
          );
          filePath = path.join(matchedCase.fallbackDir, req.url);
        } else {
          console.log(
            `${req.url} not found, using ${matchedCase.fallbackPath}`,
          );
          filePath = matchedCase.fallbackPath;
        }
        serveFile(filePath, res);
      } else {
        serveFile(filePath, res);
      }
    });
    return;
  }

  let filePath;
  for (const [prefix, dir] of Object.entries(urlMappings)) {
    if (req.url.startsWith(prefix)) {
      filePath = path.join(dir, req.url.slice(prefix.length));
      serveFile(filePath, res);
      return;
    }
  }

  filePath = path.join(rootDir, safeSuffix === "/" ? "index.html" : safeSuffix);
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
          console.log("Serving " + filePath);
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
}

const wss = new WebSocketServer({ port: DEBUG_PORT });

wss.on("connection", () => {
  console.log("Client connected");
});

server.listen(SERVER_PORT, host, () => {
  console.log(
    `Server running at ${
      useHttps ? "https" : "http"
    }://${host}:${SERVER_PORT}, serving directory: ${rootDir}`,
  );
});

const watcher = chokidar.watch([rootDir, uixDir, frontendDir, backendDir]);

watcher.on("change", (filePath) => {
  console.log(`File ${filePath} has been changed. Refreshing...`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("refresh");
    }
  });
});

console.log("Watching...");
