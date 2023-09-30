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

const P2P = {
  postMessage: (payload) => {
    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({ ...payload, bridge: true });
      }
    });
  },
};

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
      type: "INIT_APP",
      appId,
      userId,
    });
  },

  SYNC_DATA: async (data) => {
    const { data: syncData, appId } = data;
    for (let [model, entries] of Object.entries(syncData)) {
      const db = adapter.createStore(`${appId}_${model}`, "kv");
      await adapter.clear(db);
      await adapter.setMany(entries, db);
    }

    requestUpdate();
  },

  OPLOG_WRITE: async (data) => {
    const { store, key, value } = data;
    const db = adapter.createStore(store, "kv");
    console.log({ value });
    if (value) {
      await adapter.setItem(key, value, db);
    } else {
      await adapter.removeItem(key, db);
    }
    P2P.postMessage({ type: "OPLOG_WRITE", store, key, value });

    if (data.requestUpdate) requestUpdate();
  },
};

self.addEventListener("message", async (event) => {
  const handler = messageHandlers[event.data.type];
  if (handler) {
    console.log("DEBUG: Received bridge-message from Web Worker: ", { event });
    try {
      await handler(event.data, event.source);
    } catch (error) {
      console.error(`Error handling ${event.data.type}:`, error);
    }
  }
});
