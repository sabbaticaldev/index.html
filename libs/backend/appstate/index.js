import idbAdapter from "../indexeddb/index.js";
import ReactiveRecord from "../reactive-record/index.js";
import { fromBase62, generateIdWithUserId } from "../utils.js";
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

export const startBackend = async (app) => {
  const { version = 1 } = app;
  console.log("INIT APP");

  let dbName = "default";
  const models = { app: workspaceModelDefinition, ...(app.models || {}) };

  const stores = await idbAdapter.createDatabase(
    dbName,
    Object.keys(models),
    version,
  );

  ReactiveRecord.appId = generateIdWithUserId(new Date().getTime().toString());
  ReactiveRecord.stores = stores;
  ReactiveRecord.models = models;

  // Check if an entry exists in the app store
  const existingAppEntry = await ReactiveRecord.get("app", "default");

  if (!existingAppEntry) {
    // Add an entry to the app store with version, models, and timestamp (appId)
    const timestamp = new Date().getTime();
    const appEntry = {
      id: "default",
      models: Object.keys(models),
      version,
      timestamp,
    };
    await ReactiveRecord.add("app", appEntry);
    console.log("App entry added:", appEntry);
    return appEntry;
  }

  console.log("Existing app entry found:", existingAppEntry);
  return existingAppEntry;
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