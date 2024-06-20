import "./index-html.js";

import ReactiveView, { UnoTheme } from "./reactive-view/base.js";

const frontend = async () => {
  ReactiveView.install();
};
// Function to load the app and register the service worker if available
const loadApp = async ({ app }) => {
  if (!app) return console.error("DEBUG: App not found.");
  ReactiveView.unoRuntime(UnoTheme);
  frontend({ app });
};

// Bootstrap function to initialize the application based on the environment
const bootstrap = async ({ app, env, backend }) => {
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
  return loadApp({ app, backend });
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
