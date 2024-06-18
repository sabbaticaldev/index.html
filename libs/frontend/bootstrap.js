import "./index-html.js";

import ReactiveView, { UnoTheme } from "./reactive-view/base.js";
import reset from "./reset.txt";
const frontend = async ({ app, style }) => {
  if (!app) throw new Error("Error: no App found");
  if (app.title) document.title = app.title;
  if (app.init) await app.init({ style, app });
  const styleEl = document.createElement("style");
  styleEl.textContent = reset;
  document.head.append(styleEl);
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
    const ws = new WebSocket("ws://localhost:4001");
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
