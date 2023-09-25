import { defineControllers } from "./scaffold/controller/reactive-controller.mjs";
import { defineModels } from "./scaffold/model/reactive-record.mjs";
import modelList from "./models.mjs";
import controllerList from "./controllers.mjs";

const models = defineModels(modelList);
const controllers = defineControllers(controllerList, models);

// Convert the endpoint string to a regular expression.
const endpointToRegex = (endpoint) => {
  const [method, path] = endpoint.split(" ");
  const regexPath = path
    .split("/")
    .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
    .join("/");
  return new RegExp(`^${method} ${regexPath}$`);
};

const api = Object.entries(controllerList).reduce(
  (acc, [controllerName, controller]) => {
    if (controller.endpoints) {
      Object.entries(controller.endpoints).forEach(([endpoint, callback]) => {
        const regex = endpointToRegex(endpoint);
        acc[String(endpoint)] = {
          regex,
          controller: controllers[controllerName],
          callback,
        };
      });
    }
    return acc;
  },
  {},
);

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

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

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const request = `${event.request.method} ${url.pathname}`;

  const matchedEndpointKey = Object.keys(api).find((endpointKey) => {
    const { regex } = api[endpointKey];
    return regex.test(request);
  });

  if (!matchedEndpointKey) return;

  console.log({ matchedEndpointKey });
  event.respondWith(
    (async () => {
      try {
        const {
          callback,
          controller,
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
        console.log("to aqui?");
        const allParams = { ...pathParams, ...bodyParams, ...queryParams };
        const response = await callback.call(controller, allParams);

        if (["POST", "PATCH", "DELETE"].includes(event.request.method)) {
          self.clients
            .matchAll()
            .then((clients) =>
              clients.forEach((client) => client.postMessage("REQUEST_UPDATE")),
            );
        }

        console.log({ response, allParams });

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
