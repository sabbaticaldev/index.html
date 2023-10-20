import { connect } from "./controller.mjs";
import { setModels, setControllers, getAppId } from "./appstate.mjs";

export let worker;
export let dataChannel;

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

export const initializeApp = async ({
  appId: userAppId,
  models,
  controllers,
}) => {
  const appId = userAppId || (await getAppId());
  if (!worker && appId) {
    const modelList = await setModels(appId, models);
    await setControllers(appId, controllers);
    worker = new Worker("/controller.mjs", { type: "module" });
    worker.onmessage = (event) => {
      console.log("DEBUG: event on RTC Worker: ", { event });
    };

    navigator.serviceWorker.onmessage = (e) => {
      if (e.data.bridge) {
        console.log("DEBUG: received message from service worker", { e });
        if (dataChannel) {
          dataChannel.send(JSON.stringify(e.data));
        }
      }
    };
    navigator.serviceWorker.controller.postMessage({
      type: "INIT_BACKEND",
      appId,
      models: modelList,
      bridge: true,
    });

    const connectCallback = (channel) => {
      dataChannel = channel;
      connection.connected = true;
    };

    /*    const connection = connect({
      username: appId + "|" + userId,
      callback: connectCallback,
    });

    if (connection?.call && !connection.connected) {
      if (appId && userId !== "1") {
        connection
          .call(appId, userId, [appId, "1"].join("|"), models)
          .then(connectCallback);
      }
    } */
  }
  return worker;
};

export default { postMessage, initializeApp, worker };
