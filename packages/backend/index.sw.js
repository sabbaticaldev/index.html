import { handleFetch, messageHandler, P2P, requestUpdate } from "./index.js";
import { startDatabase } from "./libs/appstate.js";
import { T } from "./libs/types.js";

self.T = T;

// Cache name
const CACHE_NAME = "external-resources-cache";

// List of domains to cache
const CACHE_DOMAINS = [
  "https://esm.sh/",
  "https://cdn.jsdelivr.net/",
  "https://unpkg.com/",
];

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

self.addEventListener("message", (event) => {
  const message = event.data;
  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage(message);
      });
    });
});

self.addEventListener("message", messageHandler({ P2P, requestUpdate }));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (CACHE_DOMAINS.some((domain) => url.href.startsWith(domain))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }),
    );
  } else {
    event.respondWith(
      url.pathname.startsWith("/api")
        ? handleFetch({ event, url })
        : fetch(event.request),
    );
  }
});
