import adapter from "./indexeddb.mjs";

export const events = {};
let dataChannel;
export const Backend = {
  postMessage: (payload) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("DEBUG: posting message to serviceworker:", { payload });
      navigator.serviceWorker.controller.postMessage(payload);
    }
  },
};

export const P2P = {
  postMessage: (payload) => {
    if (!dataChannel)
      console.log("DEBUG: postMessage without an open datachannel");
    if (dataChannel) {
      dataChannel.send(JSON.stringify(payload));
    }
  },
  dispatch: (event, channel) => {
    console.log(event.data);
    const message = JSON.parse(event.data);
    const { type, ...payload } = message;
    const handler = events[type];
    if (handler) {
      dataChannel = channel;
      handler(payload);
    } else {
      console.warn("DEBUG: No handler registered for message type:", type);
    }
  },
};

export const registerEvent = (type, handler) => {
  events[type] = handler;
};

const syncRequest = async ({ appId, models }) => {
  console.log("DEBUG: Sync request received:", { appId, models });

  // Prepare an object to hold the fetched data
  const data = {};

  // Fetch data from IndexedDB for each model
  for (let model of models) {
    const db = adapter.createStore(`${appId}_${model}`);
    const entries = await adapter.entries(db);
    data[model] = entries;
  }

  // Send the fetched data over the data channel
  dataChannel.send(JSON.stringify({ type: "SYNC_DATA", data, appId: appId }));
};

const syncData = async ({ data, appId }) => {
  console.log("DEBUG: Sync data received:", data);
  Backend.postMessage({
    action: "SYNC_DATA",
    appId,
    data,
  });
};

registerEvent("SYNC_REQUEST", syncRequest);
registerEvent("SYNC_DATA", syncData);
