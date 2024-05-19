export {
  messageHandler,
  requestUpdate,
  startBackend
} from "./libs/appstate.js";
import {
  requestUpdate,
} from "./libs/appstate.js";
import { BOOL_TABLE } from "./libs/constants.js";
import idbAdapter from "./libs/indexeddb.js";
import ReactiveRecord from "./libs/reactive-record.js";
export { extractPathParams } from "./libs/utils.js";

export const fetchDataFromDB = async (appId, models) => {
  const dataPromises = models.map(async (model) => {
    const db = idbAdapter.createStore(`${appId}_${model}`);
    const entries = await idbAdapter.entries(db);
    return { model, entries };
  });

  const results = await Promise.all(dataPromises);
  const data = {};

  results.forEach(({ model, entries }) => {
    data[model] = entries;
  });

  return data;
};

export const postMessage = (payload) => {
  if (self && self.dispatchEvent) {
    console.log(
      "DEBUG: Send event to service worker queue from reactive-record",
      { payload },
    );
    const message = new MessageEvent("message", {
      data: payload,
    });
    self.dispatchEvent(message);
  }
};

export const P2P = {
  _handleClients: (action) => {
    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients.forEach((client) => action(client));
      }
    });
  },

  postMessage: (payload) => {
    P2P._handleClients((client) => client.postMessage(payload));
  },

  execute: (func) => {
    P2P._handleClients((client) => func(client));
  },
};

const endpointNotFound = new Response(
  JSON.stringify({ error: "ERROR: endpoint not found" }),
  {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
  },
);


export const handleFetch = async ({ event, url }) => {
  const method = event.request.method;
  const [,, model, id] = url.pathname.split("/");
  if (!ReactiveRecord.models[model]) {
    return endpointNotFound;
  }

  try {
    const queryParams = [...url.searchParams.entries()].reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: ["false", "true"].includes(value) ? BOOL_TABLE[value] : value,
      }),
      {},
    );
    console.log({model, id});
    const bodyMethods = ["POST", "PATCH"];
    const bodyParams = bodyMethods.includes(method)
      ? await event.request.clone().json().catch((err) => {
        console.error("Failed to parse request body", err);
        return {};
      })
      : {};

    const params = { ...queryParams, ...bodyParams };
    const actionMap = {
      GET: id
        ? () => ReactiveRecord.get(model, id, params)
        : () => ReactiveRecord.getMany(model, null, params),
      POST: () =>
        Array.isArray(params)
          ? ReactiveRecord.addMany(model, params)
          : ReactiveRecord.add(model, params),
      PATCH: () =>
        id
          ? ReactiveRecord.edit(model, { id, ...params })
          : endpointNotFound,
      DELETE: () => (id ? ReactiveRecord.remove(model, id) : endpointNotFound),
    };

    if (!actionMap[method]) {
      return endpointNotFound;
    }
    
    const response = await actionMap[method]();

    if (["POST", "PATCH", "DELETE"].includes(method)) {
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
    console.trace();
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
