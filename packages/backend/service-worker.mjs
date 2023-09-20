import controllers from "./controllers.mjs";

const api = Object.values(controllers)
  .map((module) => module.endpoints) // Map to the endpoints object from the default export
  .filter(Boolean) // Filter out controllers that might not have the endpoints field
  .reduce(
    (acc, endpoints) => ({
      ...acc,
      ...endpoints,
    }),
    {},
  ); // Merge all endpoint objects into one

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// src/service-worker.js or src/service-worker.ts
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const result = api[url.pathname];
  if (result) {
    console.log(url.pathname, api[url.pathname]);
    event.respondWith(
      new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": Array.isArray(result)
            ? "text/event-stream"
            : "text/json",
        },
      }),
    );
  }
});
