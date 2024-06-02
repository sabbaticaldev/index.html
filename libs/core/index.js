import { startBackend } from "backend";
import {
  appKit,
  chatKit,
  contentKit,
  crudKit,
  datetimeKit,
  defineView,
  docsKit,
  extractSafelistFromTheme,
  formKit,
  getUnoGenerator,
  layoutKit,
  loadTheme,
  navigationKit,
  pageKit,
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

//TODO: change the gathering of the theme components to here from reactive-view
export const loadFrontendFiles = (app) => {
  const packages = {
    app,
    appKit,
    chatKit,
    contentKit,
    crudKit,
    pageKit,
    datetimeKit,
    docsKit,
    formKit,
    layoutKit,
    navigationKit,
  };

  const loadedPackages = Object.keys(packages).reduce(
    (acc, key) => {
      const { views } = packages[key];
      return { ...acc, views: { ...acc.views, ...views } };
    },
    { views: {} },
  );
  loadTheme(loadedPackages.views);
  return loadedPackages;
};

export const startFrontend = ({ app, style }) => {
  const { views } = app;
  Object.entries(views).forEach(([tag, component]) => {
    if (!component.tag) component.tag = tag;
    defineView({ component, style });
  });
};

const injectApp = async (app, style) => {
  if (!app) throw new Error("Error: no App found");
  if (app.title) document.title = app.title;

  const frontendState = startFrontend({ app, style });
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
  const loadedApp = loadFrontendFiles(app);
  const themeClasses = extractSafelistFromTheme(null, loadedApp.theme);
  const uno = getUnoGenerator(themeClasses);
  const { css } = await uno.uno.generate(themeClasses, { preflights: true });

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
        await injectApp(
          loadedApp,
          [reset, css, style].filter((s) => s).join(" "),
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
