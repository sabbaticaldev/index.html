import { messageHandler, getApiModel } from "./appstate.mjs";

const requestUpdate = () =>
  self.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) => client.postMessage("REQUEST_UPDATE")),
    );

const P2P = {
  postMessage: (payload) => {
    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({ ...payload, bridge: true });
      }
    });
  },
};

self.addEventListener("message", messageHandler({ P2P, requestUpdate }));

const extractPathParams = (endpoint, requestPath, regex) => {
  const paramNames = [...endpoint.matchAll(/:([a-z]+)/gi)].map(
    (match) => match[1],
  );
  const paramValues = requestPath.match(regex).slice(1);
  return paramNames.reduce(
    (acc, name, index) => ({ ...acc, [name]: paramValues[index] }),
    {},
  );
};

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  // If the request doesn't start with /api/, fetch it normally.
  if (!url.pathname.startsWith("/api")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      const { api } = await getApiModel();
      const request = `${event.request.method} ${url.pathname}`;

      const matchedEndpointKey = Object.keys(api).find((endpointKey) => {
        const { regex } = api[endpointKey];
        return regex.test(request);
      });
      if (!matchedEndpointKey)
        return new Response(
          JSON.stringify({ error: "ERROR: endpoint not found" }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      try {
        const {
          callback,
          model,
          regex: endpointRegex,
        } = api[matchedEndpointKey];

        const pathParams = extractPathParams(
          matchedEndpointKey,
          request,
          endpointRegex,
        );
        const queryParams = [...url.searchParams.entries()].reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {},
        );

        const bodyMethods = ["POST", "PATCH"];
        const bodyParams = bodyMethods.includes(event.request.method)
          ? await event.request
            .json()
            .catch((err) =>
              console.error("Failed to parse request body", err),
            )
          : {};

        const allParams = { ...pathParams, ...bodyParams, ...queryParams };
        const response = await callback.call(model, allParams);

        if (["POST", "PATCH", "DELETE"].includes(event.request.method)) {
          requestUpdate();
        }

        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": Array.isArray(response)
              ? "text/event-stream"
              : "application/json",
          },
        });
      } catch (error) {
        console.error({ error });
        throw error;
      }
    })(),
  );
});
