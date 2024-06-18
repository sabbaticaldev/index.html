import { handleFetch, messageHandler, P2P, requestUpdate } from "./index.js";
import { startDatabase } from "./libs/appstate.js";
import { T } from "./libs/types.js";

self.T = T;
// Fetch app data from IndexedDB and start the backend
const initializeBackend = async () => {
  console.log("start backend in service worker");
  const models = self.models;
  await startDatabase({ models });
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
