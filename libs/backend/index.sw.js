import { handleFetch, messageHandler, P2P, requestUpdate } from "./index.js";
import { startBackend } from "./libs/appstate.js";
import idbAdapter from "./libs/indexeddb.js";
import { stringToType, T, TYPE_MAP, typeHandlers } from "./libs/types.js";

self.T = T;
self.stringToType = stringToType;
self.TYPE_MAP = TYPE_MAP;
self.typeHandlers = typeHandlers;

self.messageHandler = messageHandler;
self.P2P = P2P;
self.requestUpdate = requestUpdate;
self.startBackend = startBackend;
self.handleFetch = handleFetch;
self.idbAdapter = idbAdapter;

try {
  importScripts("/models.js");
} catch (e) {
  console.error("Error loading backend: No models.js found.");
}
// Fetch app data from IndexedDB and start the backend
const initializeBackend = async () => {
  console.log("start backend in service worker");
  const models = self.models;
  console.log({ models });
  if (idbAdapter.checkStoreExists("default")) {
    const app = await idbAdapter.getApp();
    return await startBackend({ app, models });
  }
  console.error("Database not initialized");
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.info("Service Worker Activated");
  event.waitUntil(Promise.all([self.clients.claim(), initializeBackend()]));
});

self.addEventListener("message", messageHandler({ P2P, requestUpdate }));

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  event.respondWith(
    url.pathname.startsWith("/api")
      ? handleFetch({ event, url })
      : fetch(event.request),
  );
});
console.log("PASSEI POR AQUI");
