//import { connect } from "./controller.js";

//export let worker;
export function event(type, ...attrs) {
  const message = { type };
  attrs.forEach((attr) => {
    Object.assign(message, attr);
  });
  navigator.serviceWorker.controller.postMessage(message);
}

export let dataChannel;

export const startBackend = async ({ appId, models, baseModels, version }) => {
  navigator.serviceWorker.onmessage = (e) => {
    if (e.data.bridge) {
      console.log("DEBUG: received message from service worker", { e });
      if (dataChannel) {
        dataChannel.send(JSON.stringify(e.data));
      }
    }
  };

  if (!navigator.serviceWorker.controller) {
    if (!sessionStorage.getItem("attemptedRefresh")) {
      sessionStorage.setItem("attemptedRefresh", "true");
      window.location.reload();
    } else {
      console.error(
        "Service worker not in control after refresh, further action needed."
      );
      sessionStorage.removeItem("attemptedRefresh");
    }
  } else {
    event("INIT_BACKEND", {
      appId,
      models,
      baseModels,
      version
    });
    sessionStorage.removeItem("attemptedRefresh");
  }

  /*
    worker = new Worker("/brazuka/src/web-worker.js", {
      type: "module",
      scope: "/"
    });
    worker.addEventListener("error", function (errorEvent) {
      console.error(
        "Worker error:",
        { errorEvent },
        "at line:",
        errorEvent.lineno
      );
    });
    worker.onerror = (error) => {
      console.error("DEBUG: error on RTC Worker: ", { error });
      throw error;
    };

    worker.onmessage = (event) => {
      console.log("DEBUG: event on RTC Worker: ", { event });
    };

    //const connectCallback = (channel) => {
    //      dataChannel = channel;
    //    connection.connected = true;
    //};

       const connection = connect({
      username: appId + "|" + userId,
      callback: connectCallback,
    });

    if (connection?.call && !connection.connected) {
      if (appId && userId !== "1") {
        connection
          .call(appId, userId, [appId, "1"].join("|"), models)
          .then(connectCallback);
      }
    }
    
  return worker; */
  return { appId };
};

export default { startBackend };
