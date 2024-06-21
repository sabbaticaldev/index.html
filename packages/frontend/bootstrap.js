import "./index-html.js";

import models from "/models.js";
self.models = models;

import ReactiveView, { UnoTheme } from "./reactive-view/base.js";

const bootstrap = async ({ env, backend }) => {
  if (env === "development") {
    const currentPort = window.location.port;
    const debugPort = parseInt(currentPort, 10) + 1;
    const wsUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${
      window.location.hostname
    }:${debugPort}`;
    const ws = new WebSocket(wsUrl);

    ws.addEventListener("message", (event) => {
      if (event.data === "refresh") {
        console.log("DEBUG: Received refresh request");
        window.location.reload();
      }
    });
  }
  if (backend) startSW();

  ReactiveView.unoRuntime(UnoTheme);
  ReactiveView.install();
};

export const startSW = async () => {
  try {
    console.log("Service Worker starting.");
    await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
      type: "module",
    });
    console.log("Service Worker started.");
  } catch (error) {
    console.error("Error loading service-worker", { error });
  }
};

export default bootstrap;
