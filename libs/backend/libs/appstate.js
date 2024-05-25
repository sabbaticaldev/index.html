import { createDatabase, getApp } from "./indexeddb.js";
import ReactiveRecord from "./reactive-record.js";

let models = {};

export const events = {
  INIT_BACKEND: async (data, { source }) => {
    source.postMessage({
      type: "BACKEND_INITIALIZED",
    });
  },
  PAGE_BUILDER_UPDATE_PAGE: async (data, { P2P }) => {
    const { title, url } = data;
    const TabsModel = models.tabs;
    const tabs = await TabsModel.getMany();
    const updateTabs = tabs
      .filter((tab) => tab.title === title)
      .map((tab) => ({ ...tab, url }));
    TabsModel.editMany(updateTabs);
    P2P.execute((client) => {
      if (client.url.includes(url.split("#")[0])) {
        client.navigate(url);
      }
    });
  },
  SYNC_DATA: async (data, { requestUpdate }) => {
    const { data: syncData } = data;
    for (let [modelName, entries] of Object.entries(syncData)) {
      const model = models[modelName];
      if (model) model?.setMany(entries);
    }
    requestUpdate();
  },
  REQUEST_UPDATE: async (data, { requestUpdate }) => {
    const { store } = data || {};
    requestUpdate(store);
  },
};

export let appId;
export let api;

export const workspaceModelDefinition = {
  timestamp: {
    type: "number",
    primary: true,
  },
  models: {
    type: "object",
  },
  version: {
    type: "number",
  },
  migrationTimestamp: {
    type: "number",
  },
};

const initializeDatabase = async ({
  dbName = "default",
  models = {},
  version = 1,
}) => {
  const stores = await createDatabase(dbName, Object.keys(models), version);
  ReactiveRecord.stores = stores;
  ReactiveRecord.models = models;
  console.log("APP STATE ", { models });
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
    models,
    version,
    timestamp,
    migrationTimestamp: 0, // Initial migration timestamp set to 0
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
  const { data = {} } = app;

  if (!isSW) {
    await initializeDatabase({ dbName, models, version });
    const app = await getApp();
    if (app) {
      console.log("Existing app entry found:", app);
      ReactiveRecord.appId = app.timestamp;
      importData({ data, app });
      return app;
    }
    return await createAppEntry(models, version);
  } else {
    await initializeDatabase({ dbName, models, version });
  }
  ReactiveRecord.appId = app.timestamp;
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
