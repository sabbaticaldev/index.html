import { createDatabase, getApp } from "./indexeddb.js";
import ReactiveRecord from "./reactive-record.js";
import { T } from "./types.js";
export let appId;
export let api;

const workspaceModelDefinition = {
  timestamp: T.number({ primary: true }),
  imported: T.boolean(),
  version: T.number(),
  migrationTimestamp: T.number(),
};

const importData = async ({ app, data = {} }) => {
  const dataArray = Object.entries(data);
  if (dataArray.length) {
    // Check if the data has already been migrated
    const migrationTimestamp = app?.migrationTimestamp || 0;

    // If no migration timestamp or it is zero, perform the data import
    if (migrationTimestamp === 0) {
      for (const [modelName, entries] of dataArray) {
        await ReactiveRecord.addMany(modelName, entries);
      }

      // Update the migration timestamp after importing data
      await ReactiveRecord.edit("app", {
        id: "default",
        migrationTimestamp: Date.now(),
      });
    }
  }
};

const createAppEntry = async (models, version) => {
  const timestamp = Date.now();
  ReactiveRecord.appId = timestamp;
  const appEntry = {
    id: "default",
    version,
    timestamp,
    migrationTimestamp: 0, // Initial migration timestamp set to 0
  };
  await ReactiveRecord.add("app", appEntry);
  console.log("App entry added:", appEntry);
  return appEntry;
};

export const startDatabase = async ({
  models: userModels,
  version = 1,
  data = {},
  timestamp: AppTimestamp,
  env = "development",
} = {}) => {
  if (env === "development") console.log("Starting app in development mode");
  const timestamp = AppTimestamp ?? Date.now();
  const dbName = "default";
  const models = { app: workspaceModelDefinition, ...(userModels || {}) };

  const stores = await createDatabase(dbName, Object.keys(models), version);
  ReactiveRecord.stores = stores;
  ReactiveRecord.models = models;
  let app = await getApp();
  if (app) {
    console.log("Existing app entry found:", app);
    ReactiveRecord.appId = timestamp;
    return app;
  } else app = await createAppEntry(models, version);
  if (!app.imported) importData({ data, app });
  ReactiveRecord.appId = timestamp;
};
const events = {};
export const messageHandler =
  ({ requestUpdate, P2P }) =>
  async (event) => {
    const handler = events[event.data.type];
    if (handler) {
      console.log("DEBUG - service worker event: ", { event });
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

export const requestUpdate = (store) =>
  self.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) =>
        client.postMessage("REQUEST_UPDATE", { store }),
      ),
    );
