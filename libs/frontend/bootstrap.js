import ReactiveView, { UnoTheme } from "./reactive-view/base.js";
import reset from "./reset.txt";

export const getUrlBlob = () => {
  const extractedContent = decodeURIComponent(
    window.location.hash.substring(1),
  );
  if (!extractedContent) return null;
  const blob = new Blob([extractedContent], { type: "application/javascript" });
  return blob;
};

const injectApp = async ({ app, style }) => {
  if (!app) throw new Error("Error: no App found");
  if (app.title) document.title = app.title;

  ReactiveView.install();
  if (app.init) await app.init({ style, app });
  const styleEl = document.createElement("style");
  styleEl.textContent = reset;
  document.head.append(styleEl);
};

const loadAppFromBlob = async ({ app, style, backend }) => {
  const blobURL = URL.createObjectURL(app);
  const module = await import(blobURL);
  const loadedApp = module.default;
  loadedApp.frontendOnly = !backend;
  loadApp({ app: loadedApp, style, backend });
};

// Function to load the app and register the service worker if available
const loadApp = async ({ app, backend }) => {
  ReactiveView.unoRuntime(UnoTheme);
  if (!app) return console.error("DEBUG: App not found.");
  if (backend && "serviceWorker" in navigator) {
    try {
      const appData = await backend({
        ...app,
        models: app.models,
        version: app.version,
      });
      console.log("Starting app ", { appData });
      console.log("start service worker");
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        { scope: "/" },
      );
      console.info("ServiceWorker registration successful:", registration);
      setTimeout(async () => {
        await injectApp({
          app,
        });
      }, 0);
    } catch (error) {
      console.error("Error loading service-worker", { error });
    }
  }
};

const environmentStrategies = {
  production: async (backend) => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app, backend });
  },
  staging: async (backend) => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app, backend });
    window.addEventListener("hashchange", () => window.location.reload());
  },
  preview: async (backend) => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app, backend }, true);
    window.addEventListener("hashchange", () => window.location.reload());
  },
  development: async (backend) => {
    const ws = new WebSocket("ws://localhost:4001");
    ws.addEventListener("message", (event) => {
      if (event.data === "refresh") {
        console.log("DEBUG: Received refresh request");
        window.location.reload();
      }
    });
    loadApp({ app: window.App, backend });
  },
};

// Bootstrap function to initialize the application based on the environment
const bootstrap = async ({ env, backend }) => {
  const strategy =
    environmentStrategies[env] || environmentStrategies["development"];
  return await strategy(backend);
};

export default bootstrap;
