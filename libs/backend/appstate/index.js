import idbAdapter from "../indexeddb/index.js";
import { fromBase62 } from "../utils.js";
import { events } from "./events.js";
export { events };
export let appId;
export let api;
const workspaceModelName = "workspaces";

export const workspaceModelDefinition = {
  models: {
    type: "object",
  },
  version: {
    type: "number",
  },
  timestamp: {
    type: "number",
  },
};

export const defineModels = async (props) => {
  const { appId = "default", version = 1 } = props;
  let dbName = appId;
  const models = { app: workspaceModelDefinition, ...models };

  const stores = await idbAdapter.createDatabase(
    dbName,
    Object.keys(models),
    version,
  );
  console.log({stores});
  const initialData = [];

  for (const [name, module] of Object.entries(models)) {
    if (module._initialData) initialData.push([name, module._initialData]);
  }

  if (initialData.length > 0) {
    for (const [modelName, data] of initialData) {
      if (await models[modelName].isEmpty()) {
        await models[modelName].addMany(data);
      }
    }
  }

  return models;
};


export const messageHandler =
  ({ requestUpdate, P2P }) =>
    async (event) => {
      const handler = events[event.data.type];
      if (handler) {
        console.log("DEBUG - frontend event: ", {
          event,
        });
        try {
          const messageHandlerContext = {
            source: event.source,
            requestUpdate,
            P2P,
          };
          await handler(event.data, messageHandlerContext);
        } catch (error) {
          console.error(`Error handling ${event.data.type}:`, error);
        }
      }
    };

export const requestUpdate = () =>
  self.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) => client.postMessage("REQUEST_UPDATE")),
    );

export const startBackend = async (app) => {
  const { appId = "default", models, version } = app;
  console.log("INIT APP");
  await defineModels({
    models,
    appId,
    userId: appId,
    version,
  });
  return app;
};

let timestamp;

let models = {};
export const getBaseTimestamp = async () => {
  if (timestamp) return timestamp;
  if (models[workspaceModelName]) {
    const app = await models[workspaceModelName].get("default");
    timestamp = fromBase62(app.appId);
    return timestamp;
  }
};
