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
  navigationKit,
  reset,
} from "frontend";
import { getUrlBlob, injectStyle, isValidApp } from "helpers";

export const loadFrontendFiles = (app) => {
  const theme = {};

  const packages = {
    app,
    appKit,
    chatKit,
    contentKit,
    crudKit,
    datetimeKit,
    docsKit,
    formKit,
    layoutKit,
    navigationKit,
  };

  const loadedPackages = Object.keys(packages).reduce(
    (acc, key) => {
      const { views, theme: packageTheme } = packages[key];
      theme[key] = packageTheme;
      return { ...acc, views: { ...acc.views, ...views } };
    },
    { views: {} },
  );

  return { ...loadedPackages, theme };
};

export const startFrontend = ({ app, style }) => {
  const { views } = app;
  Object.entries(views).forEach(([tag, component]) => {
    defineView({ tag, component, style });
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
  console.log({ loadedApp });
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

// Function to get the current style
const getStyle = () =>
  [reset, decodeURIComponent(window.location.search.substring(1))].join(" ");

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
