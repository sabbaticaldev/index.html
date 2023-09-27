import { connect } from "backend/src/controller.mjs";

let worker;

export const getRTCWorker = ({ appId, userId, models }) => {
  if (!worker) {
    worker = new Worker("./controller.mjs", { type: "module" });
    console.log({ worker });
    worker.onmessage = (e) => {
      if ("serviceWorker" in navigator && e.data.bridge) {
        console.log("send message to service worker");
        navigator.serviceWorker.controller.postMessage(e.data);
      }
    };

    navigator.serviceWorker.onmessage = (e) => {
      console.log("receive message from worker");
      if (e.data.bridge) {
        worker.postMessage(e.data);
      }
    };

    navigator.serviceWorker.controller.postMessage({
      type: "INIT_APP",
      appId,
      userId,
      models,
      bridge: true,
    });
    const connection = connect({
      username: appId + "|" + userId,
    });
    if (connection?.call && !connection.connected) {
      if (appId && userId !== "1") {
        connection
          .call(appId, userId, [appId, "1"].join("|"), models)
          .then(() => (connection.connected = true));
      }
    }
  }
  return worker;
};
