import { defineControllers } from "./reactive-controller.mjs";
import { defineModels } from "./reactive-record.mjs";
import modelList from "./models.mjs";
import controllerList from "./controllers.mjs";
import { getAppId, setAppId, getUserId } from "./helpers.mjs";
import adapter from "./indexeddb.mjs";

function getDefaultCRUDEndpoints(modelName, endpoints = {}) {
  return {
    [`GET /${modelName}`]: function () {
      return this.getMany();
    },
    [`GET /${modelName}/:id`]: function ({ id }) {
      return this.get(id);
    },
    [`POST /${modelName}`]: function (item) {
      return this.add(item);
    },
    [`DELETE /${modelName}/:id`]: function ({ id }) {
      return this.remove(id);
    },
    [`PATCH /${modelName}/:id`]: function ({ id, ...rest }) {
      return this.edit({ id, ...rest });
    },
    ...endpoints,
  };
}

const requestUpdate = () =>
  self.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) => client.postMessage("REQUEST_UPDATE")),
    );

const models = defineModels(modelList);
const controllers = defineControllers(models);

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
    const endpoints = getDefaultCRUDEndpoints(
      controllerName,
      controller.endpoints,
    );

    Object.entries(endpoints).forEach(([endpoint, callback]) => {
      const regex = endpointToRegex(endpoint);
      acc[String(endpoint)] = {
        regex,
        controller: controllers[controllerName],
        callback,
      };
    });
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

        const allParams = { ...pathParams, ...bodyParams, ...queryParams };
        const response = await callback.call(controller, allParams);

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

self.addEventListener("message", async (event) => {
  if (event.data.action === "INIT_APP") {
    let appId = event.data.appId;
    if (appId) {
      await setAppId(appId);
    } else {
      appId = await getAppId();
    }

    const userId = await getUserId(appId);
    console.log({ appId, userId });

    event.source.postMessage({
      action: "INIT_APP",
      appId,
      userId,
    });
  }

  if (event.data.action === "SYNC_DATA") {
    const { data, appId } = event.data;

    for (let [model, entries] of Object.entries(data)) {
      const db = adapter.createStore(`${appId}_${model}`, "kv");
      await adapter.clear(db);
      await adapter.setMany(entries, db);
    }

    requestUpdate();

    event.source.postMessage({
      action: "SYNC_FINISHED",
    });
  }
});
