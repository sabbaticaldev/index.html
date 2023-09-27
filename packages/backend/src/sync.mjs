import backend from "./backend-worker.mjs";
import rtc from "./rtc-worker.mjs";

export const Backend = {
  postMessage: (payload) => {
    backend.postMessage(payload);
  },
};

export const P2P = {
  postMessage: (payload) => {
    if (backend) {
      rtc.postMessage(payload);
    } else console.log("DEBUG: worker not found.");
  },
};
