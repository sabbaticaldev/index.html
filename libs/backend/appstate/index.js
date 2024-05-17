import { createDatabase, getApp } from "../indexeddb/index.js";
import ReactiveRecord from "../reactive-record/index.js";
import { events } from "./events.js";
export { events };
export let appId;
export let api;

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


const initializeDatabase = async (dbName, models, version) => {
  const stores = await createDatabase(dbName, Object.keys(models), version);
  ReactiveRecord.stores = stores;
  ReactiveRecord.models = models;
};

const createAppEntry = async (models, version) => {
  const timestamp = Date.now();
  ReactiveRecord.appId = timestamp;
  const appEntry = {
    id: "default",
    models,
    version,
    timestamp,
  };
  await ReactiveRecord.add("app", appEntry);
  console.log("App entry added:", appEntry);
  return appEntry;
};

export const startBackend = async (app, isSW = false) => {
  console.log("INIT APP");
  const dbName = "default";
  const models = { app: workspaceModelDefinition, ...(app.models || {}) };
  const version = app.version || 1;

  if (!isSW) {
    await initializeDatabase(dbName, models, version);
    const existingApp = await getApp();
    if (existingApp) {
      console.log("Existing app entry found:", existingApp);
      return existingApp;
    }
    
    return await createAppEntry(models, version);
  }
  else {
    console.log({app});
    await initializeDatabase(dbName, models, version);
  }
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