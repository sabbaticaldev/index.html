import { startBackend } from "backend";
import {
  appKit,
  chatKit,
  contentKit,
  crudKit,
  datetimeKit,
  definePackage,
  docsKit,
  formKit,
  layoutKit,
  navigationKit,
  reactiveViewInstances,
  reset,
  uiKit
} from "frontend";
import { getUrlBlob, injectStyle, isValidApp } from "helpers";

// Utility function to update styles for all reactive view instances
const updateAllStyles = async (updateBefore = false, updateAfter = false) => {
  const result = await window.__unocss_runtime.update();
  const stylesheet = reset + result.css;
  for (const instance of reactiveViewInstances) {
    if (updateBefore) await instance.requestUpdate();
    await instance.updateStyles(stylesheet);
    if (updateAfter) await instance.requestUpdate();
    window._isLoaded = true;
  }
};

window.updateAllStyles = updateAllStyles;

// Function to start the frontend with the given app and style
const startFrontend = ({ app, style }) => {
  const packages = [
    app,
    appKit,
    navigationKit,
    docsKit,
    chatKit,
    uiKit,
    crudKit,
    formKit,
    layoutKit,
    contentKit,
    datetimeKit
  ];

  return packages.reduce(
    (acc, pkg) => {
      const result = definePackage({ pkg, style });
      return {
        models: { ...acc.models, ...result.models },
        views: { ...acc.views, ...result.views },
      };
    },
    { models: {}, views: {} }
  );
};

// Function to inject the app and initialize the frontend and backend as necessary
const injectApp = async (app, style) => {
  if (!app) throw new Error("Error: no App found");
  if (app.title) document.title = app.title;
  
  const frontendState = startFrontend({ app, style });

  if (app.init) await app.init({ style, app });

  if (window.__unocss_runtime) {
    window.__unocss_runtime.extractAll();
    setTimeout(() => {
      const styleEl = document.createElement("style");
      styleEl.textContent = reset;
      document.head.append(styleEl);
      updateAllStyles();
    }, 500);
  }

  if (!app.frontendOnly) {
    navigator.serviceWorker.addEventListener("message", async (event) => {
      if (event.data.type === "BACKEND_INITIALIZED") {
        const { appId } = event.data || {};
        localStorage.setItem("appId", appId);
        if (app.init) await app.init({ style, app });
        if (navigator.storage && navigator.storage.persist) {
          const granted = await navigator.storage.persist();
          console.log(granted
            ? "Storage will not be cleared except by explicit user action"
            : "Storage may be cleared by the UA under storage pressure."
          );
        }
      }
    });
  }

  return frontendState;
};

// Function to load the app from a blob URL
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
  if (!app) return console.error("DEBUG: App not found.");
  if (!isValidApp(app)) return console.error("DEBUG: App is invalid.", { app });

  if ("serviceWorker" in navigator) {
    try {

      if (!app.frontendOnly) {
        let appId = localStorage.getItem("appId");
        if (["undefined", "null", "\"\""].includes(appId)) appId = null;
        if (!appId) {
          appId = Date.now().toString();
          localStorage.setItem("appId", appId);
        }
        await startBackend({ appId, models: app.models, version: app.version });
      }
      
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      console.info("ServiceWorker registration successful:", registration);
      
      setTimeout(async () => {
        if (registration.active) {
          await injectApp(app, style);
        }
      }, 0);
    } catch (error) {
      console.error("Error loading service-worker", { error });
    }
  }
};

// Function to get the current style
const getStyle = () => [reset, decodeURIComponent(window.location.search.substring(1))].join(" ");

// Strategies for different environments
const environmentStrategies = {
  production: async () => {
    const app = getUrlBlob();
    const style = getStyle();
    if (style) injectStyle(style);
    if (app) await loadAppFromBlob({ app, style });
  },
  staging: async () => {
    await import("unocss");
    const app = getUrlBlob();
    if (app) await loadAppFromBlob({ app });
    window.addEventListener("hashchange", () => window.location.reload());
  },
  preview: async () => {
    await import("unocss");
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
    await import("unocss");
    loadApp({ app: window.App });
  }
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
