import { startBackend } from "backend";
import { defineView, getUnoGenerator, ReactiveView, reset } from "frontend";

export const loadFrontendFiles = (app) => {
  const packages = {
    app,
    ...ReactiveView.packages,
  };
  console.log({ packages });
  const loadedPackages = Object.values(packages).flatMap((pkg) =>
    Object.values(pkg.views),
  );
  loadedPackages.forEach((component) => {
    if (component && component.tag && component._theme) {
      ReactiveView.addThemeClasses(component);
    }
  });
  return loadedPackages;
};

export const getUrlBlob = () => {
  const extractedContent = decodeURIComponent(
    window.location.hash.substring(1),
  );
  if (!extractedContent) return null;
  const blob = new Blob([extractedContent], { type: "application/javascript" });
  return blob;
};

export const startFrontend = ({ components, style }) => {
  console.log({ style });
  components.forEach((component) => {
    defineView({ component, style });
  });
  ReactiveView.install(style);
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

const loadAppFromBlob = async ({ app, style, backend }) => {
  const blobURL = URL.createObjectURL(app);
  const module = await import(blobURL);
  const loadedApp = module.default;
  loadedApp.frontendOnly = !backend;
  loadApp({ app: loadedApp, style, backend });
};

// Function to load the app and register the service worker if available
const loadApp = async ({ app, style, backend }) => {
  const appFiles = loadFrontendFiles(app);
  const safelist = Object.values(ReactiveView.UnoTheme).flat().join(" ");
  const uno = getUnoGenerator(safelist, ReactiveView.UnoTheme);
  const { css } = await uno.uno.generate(Object.keys(ReactiveView.UnoTheme), {
    preflights: true,
  });
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
          components: appFiles,
          style: [reset, css, style].filter((s) => s).join(" "),
        });
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
