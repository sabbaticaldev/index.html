const controllers = {};
console.log("TESTANDO ????");
const api = Object.entries(controllers)
  .map(([moduleName, module]) => module.endpoints) // Map to the endpoints object from the default export
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
  console.log("TESTANDO ???? 22222");
});

// src/service-worker.js or src/service-worker.ts
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const result = api[url.pathname];
  console.log("TESTANDO ???? 44444");
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
