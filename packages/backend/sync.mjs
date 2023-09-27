import adapter from "./indexeddb.mjs";

export const events = {};

export const registerEvent = (type, handler) => {
  events[type] = handler;
};

export const dispatch = ({ type, ...payload }, dataChannel) => {
  const handler = events[type];
  if (handler) {
    handler(payload, dataChannel);
  } else {
    console.warn("No handler registered for message type:", type);
  }
};

const syncRequest = async ({ appId, models }, dataChannel) => {
  console.log("Sync request received:", { appId, models });

  // Prepare an object to hold the fetched data
  const data = {};

  // Fetch data from IndexedDB for each model
  for (let model of models) {
    console.log(`${appId}_${model}`);
    const db = adapter.createStore(`${appId}_${model}`);
    const entries = await adapter.entries(db);
    data[model] = entries;
  }

  // Send the fetched data over the data channel
  dataChannel.send(JSON.stringify({ type: "SYNC_DATA", data, appId: appId }));
};

const syncData = async ({ data, appId }) => {
  console.log("Sync data received:", data);

  // Iterate over each model's data and insert it into IndexedDB
  for (let [model, entries] of Object.entries(data)) {
    const db = adapter.createStore(`${appId}_${model}`, "kv");

    // Clear the store first to make sure we're syncing fresh data
    await adapter.clear(db);

    // Now, insert the new entries
    await adapter.setMany(entries, db);
  }
};

registerEvent("SYNC_REQUEST", syncRequest);
registerEvent("SYNC_DATA", syncData);

export const onDataChannelMessage = (event, dataChannel) => {
  console.log(event.data);
  const message = JSON.parse(event.data);
  dispatch(message, dataChannel);
};
