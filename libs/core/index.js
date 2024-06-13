import { startBackend } from "backend";
import {
  defineView,
  getUnoGenerator,
  UnoTheme,
  loadFrontendFiles,
  reset,
} from "frontend";

export const isValidApp = (app) => {
  if (!app) {
    throw new Error("App is not defined");
  }

  if (!app.views) {
    throw new Error("App views object is not defined");
  }
  if (!app.views["app-index"] && !app.views["page-index"]) {
    throw new Error(
      "No valid bootstrap page found in app views (app-index or page-index required)",
    );
  }

  return true;
};

export const getUrlBlob = () => {
  const extractedContent = decodeURIComponent(
    window.location.hash.substring(1),
  );
  if (!extractedContent) return null;
  const blob = new Blob([extractedContent], { type: "application/javascript" });
  return blob;
};


export const startFrontend = ({ app, components, style }) => {
  console.log({style})
  components.forEach((component) => {
    defineView({ component, style });
  });
};

const injectApp = async ({ app, components, style }) => {
  if (!app) throw new Error("Error: no App found");
  if (app.title) document.title = app.title;

  const frontendState = startFrontend({ app, components, style });
  if (app.init) await app.init({ style, app });
  const styleEl = document.createElement("style");
  styleEl.textContent = reset;
  document.head.append(styleEl);
  return frontendState;
};

const loadAppFromBlob = async ({ app, style }, frontendOnly) => {
  const blobURL = URL.createObjectURL(app);
  const module = await import(blobURL);
  const loadedApp = module.default;
  if (isValidApp(loadedApp)) {
    loadedApp.frontendOnly = frontendOnly;
    loadApp({ app: loadedApp, style });
  }
};

// Function to load the app and register the service worker if available
const loadApp = async ({ app, style }) => {
  const appFiles = loadFrontendFiles(app);
  const safelist = Object.values(UnoTheme).flat().join(" ");
  
  const uno = getUnoGenerator(safelist);
  const { css } = await uno.uno.generate(Object.keys(UnoTheme), { preflights: true });  
  if (!app) return console.error("DEBUG: App not found.");
  if (!isValidApp(app)) return console.error("DEBUG: App is invalid.", { app });
  if ("serviceWorker" in navigator) {
    try {
      const appData = await startBackend({
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
        await injectApp( {
          app,
          components: appFiles,
          style: [reset, css, style].filter((s) => s).join(" "),
        }
        );
      }, 0);
    } catch (error) {
      console.error("Error loading service-worker", { error });
    }
  }
};

const environmentStrategies = {
  production: async () => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app });
  },
  staging: async () => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app });
    window.addEventListener("hashchange", () => window.location.reload());
  },
  preview: async () => {
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app }, true);
    window.addEventListener("hashchange", () => window.location.reload());
  },
  development: async () => {
    const ws = new WebSocket("ws://localhost:4001");
    ws.addEventListener("message", (event) => {
      if (event.data === "refresh") {
        console.log("DEBUG: Received refresh request");
        window.location.reload();
      }
    });
    loadApp({ app: window.App });
  },
};

// Bootstrap function to initialize the application based on the environment
const bootstrap = async (environment = "development") => {
  const strategy = environmentStrategies[environment];
  if (strategy) {
    await strategy();
  } else {
    console.error(`Unknown environment: ${JSON.stringify({ environment })}`);
  }
};

export default bootstrap;
