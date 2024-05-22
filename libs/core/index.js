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
  getUnoGenerator,
  layoutKit,
  navigationKit,
  reset,
  themeClasses,
  uiKit
} from "frontend";
import { getUrlBlob, injectStyle, isValidApp } from "helpers";

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
        ...app,
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
  const styleEl = document.createElement("style");
  styleEl.textContent = reset;
  document.head.append(styleEl);
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
      const appData = await startBackend({ ...app, models: app.models, version: app.version });
      console.log("Starting app ", {appData});
      console.log("start service worker");
      const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      console.info("ServiceWorker registration successful:", registration);
      setTimeout(async ()=> {
        await injectApp(app, style);
      }, 0);
      
    }
    catch (error) {
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
    
    const uno = getUnoGenerator(themeClasses);
    const { css } = await uno.uno.generate(themeClasses, { preflights: true });
    console.log({ css });
    loadApp({ app: window.App, style: [reset, css].join(" ") });
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
