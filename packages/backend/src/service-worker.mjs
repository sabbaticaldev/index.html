import { defineModels } from "./reactive-record.mjs";
import modelList from "./models.mjs";
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

// Convert the endpoint string to a regular expression.
const endpointToRegex = (endpoint) => {
  const [method, path] = endpoint.split(" ");
  const regexPath = path
    .split("/")
    .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
    .join("/");
  return new RegExp(`^${method} ${regexPath}$`);
};

const api = Object.entries(modelList).reduce((acc, [name, model]) => {
  const endpoints = getDefaultCRUDEndpoints(name, model.endpoints);

  Object.entries(endpoints).forEach(([endpoint, callback]) => {
    const regex = endpointToRegex(endpoint);
    acc[String(endpoint)] = {
      regex,
      model: models[name],
      callback,
    };
  });
  return acc;
}, {});

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

const messageHandlers = {
  INIT_APP: async (data, source) => {
    let appId = data.appId;
    if (appId) {
      await setAppId(appId);
    } else {
      appId = await getAppId();
    }

    const userId = await getUserId(appId);
    source.postMessage({
      action: "INIT_APP",
      appId,
      userId,
    });
  },

  SYNC_DATA: async (data, source) => {
    const { data: syncData, appId } = data;

    for (let [model, entries] of Object.entries(syncData)) {
      const db = adapter.createStore(`${appId}_${model}`, "kv");
      await adapter.clear(db);
      await adapter.setMany(entries, db);
    }

    requestUpdate();

    source.postMessage({
      action: "SYNC_FINISHED",
    });
  },

  OPLOG_WRITE: async (data, source) => {
    const { store, key, value } = data;
    // Parse the key to get the propName, objectId, and operationId
    const [propName, objectId, operationId] = key.split("_").slice(0, -1);

    // Update the model/store
    const db = adapter.createStore(store, "kv");
    const propKey = [propName, objectId].join("_");
    if (value) {
      console.log("update");
      await adapter.setItem(propKey, value, db);
    } else {
      await adapter.removeItem(propKey, db);
    }

    // After successful operation, request an update to the client
    requestUpdate();
  },
};

self.addEventListener("message", async (event) => {
  const handler = messageHandlers[event.data.action];
  if (handler) {
    try {
      await handler(event.data, event.source);
    } catch (error) {
      console.error(`Error handling ${event.data.action}:`, error);
    }
  }
});
