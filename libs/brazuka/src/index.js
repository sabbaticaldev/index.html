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
import { baseTheme } from "frontend/theme.js";
import {
  CSV,
  datetime,
  debounce,
  draggable,
  droparea,
  event,
  File,
  get,
  i18n,
  patch,
  post,
  remove,
  T,
  url
} from "helpers";

export {
  baseTheme,
  CSV,
  datetime,
  debounce,
  draggable,
  droparea,
  event,
  File,
  get,
  i18n,
  patch,
  post,
  remove,
  T,
  url
};

import { startBackend } from "./controller.js";

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

  packages.reduce(
    (acc, pkg) => {
      const result = definePackage({ pkg, style });
      return {
        models: { ...acc.models, ...result.models },
        views: { ...acc.views, ...result.views },
        controllers: { ...acc.controllers, ...result.controllers }
      };
    },
    { models: {}, views: {}, controllers: {} }
  );
};

async function injectApp(app, style) {
  if (!app) throw "Error: no App found";
  if (app.title) document.title = app.title;
  if (app.frontendOnly) {
    startFrontend({ app, style });
    if (app.init) await app.init?.({ style, app });
    if (window.__unocss_runtime) window.__unocss_runtime.extractAll();
    if (window.__unocss_runtime)
      setTimeout(() => {
        const styleEl = document.createElement("style");
        styleEl.textContent = reset;
        document.head.append(styleEl);
        updateAllStyles();
      }, 500);
  } else {
    navigator.serviceWorker.addEventListener("message", async (event) => {
      if (event.data.type === "BACKEND_INITIALIZED") {
        {
          const { appId } = event.data || {};
          localStorage.setItem("appId", appId);
          startFrontend({ app, style });
          if (app.init) await app.init?.({ style, app });
          if (window.__unocss_runtime) window.__unocss_runtime.extractAll();

          if (event.data) {
            if (navigator.storage && navigator.storage.persist) {
              const granted = await navigator.storage.persist();
              console.log(
                granted
                  ? "Storage will not be cleared except by explicit user action"
                  : "Storage may be cleared by the UA under storage pressure."
              );
            }
            if (window.__unocss_runtime)
              setTimeout(() => {
                const styleEl = document.createElement("style");
                styleEl.textContent = reset;
                document.head.append(styleEl);
                updateAllStyles();
              }, 500);
          }
        }
      }
    });
  }
}
export const isValidApp = (app) => {
  if (!app) {
    throw new Error("App is not defined");
  }

  if (!app.views) {
    throw new Error("App views object is not defined");
  }
  if (!app.views["app-index"] && !app.views["page-index"]) {
    throw new Error(
      "No valid bootstrap page found in app views (app-index or page-index required)"
    );
  }

  return true;
};

const getUrlBlob = () => {
  const extractedContent = decodeURIComponent(
    window.location.hash.substring(1)
  );
  if (!extractedContent) return null;
  const blob = new Blob([extractedContent], { type: "application/javascript" });
  return blob;
};
const getStyle = () => {
  return [reset, decodeURIComponent(window.location.search.substring(1))].join(
    " "
  );
};

export const injectStyle = (style) => {
  const blob = new Blob([style], { type: "text/css" });
  const blobURL = URL.createObjectURL(blob);
  const linkElem = document.createElement("link");
  linkElem.rel = "stylesheet";
  linkElem.href = blobURL;
  document.head.appendChild(linkElem);
};

const loadAppFromBlob = async ({ app, style }, frontendOnly) => {
  const blobURL = URL.createObjectURL(app);
  const module = await import(blobURL);
  if (isValidApp(module.default)) {
    module.default.frontendOnly = frontendOnly;
    loadApp({ app: module.default, style });
  }
};

const loadApp = ({ app, style }) => {
  if (!app) return console.error("DEBUG: App not found.");
  if (!isValidApp(app)) return console.error("DEBUG: App is invalid.", { app });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.info("ServiceWorker registration successful:", registration);
        setTimeout(() => {
          if (registration.active) {
            if (!app.frontendOnly) {
              const urlParams = new URLSearchParams(window.location.search);
              let appId =
                urlParams.get("appId") || localStorage.getItem("appId");
              if (["undefined", "null", "\"\""].includes(appId)) appId = null;
              const models = app.models;
              startBackend({
                appId,
                models,
                version: app.version
              }).then(() => {
                injectApp(app, style);
              });
            } else injectApp(app, style);
          }
        }, 0);
      })
      .catch((error) =>
        console.error("Error loading service-worker", { error })
      );
  }
};

const environmentStrategies = {
  production: async () => {
    const app = getUrlBlob();
    const style = getStyle();
    if (style) injectStyle(style);
    if (app) await loadAppFromBlob({ app, style });
  },

  staging: async () => {
    const stagingLoadApp = async () => {
      await import("unocss");
      const app = getUrlBlob();
      if (app) await loadAppFromBlob({ app });
    };

    window.addEventListener("hashchange", () => {
      window.location.reload();
    });
    stagingLoadApp();
  },

  preview: async () => {
    const stagingLoadApp = async () => {
      await import("unocss");
      const app = getUrlBlob();
      if (app) await loadAppFromBlob({ app }, true);
    };

    window.addEventListener("hashchange", () => {
      window.location.reload();
    });
    stagingLoadApp();
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

const bootstrap = async (environment = "development") => {
  const strategy = environmentStrategies[environment];
  if (strategy) {
    await strategy();
  } else {
    console.error(`Unknown environment: ${JSON.stringify({ environment })}`);
  }
};

export default bootstrap;
