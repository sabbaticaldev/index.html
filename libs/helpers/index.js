export * as CSV from "./csv.js";
export { default as datetime } from "./datetime.js";
export { draggable, droparea } from "./droparea.js";
export * as File from "./file.js";
export { default as i18n } from "./i18n.js";
export { get, patch, post, remove } from "./rest.js";
export { stringToType,T } from "./types.js";
export { default as url } from "./url.js";

export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function event(type, ...attrs) {
  const message = { type };
  attrs.forEach((attr) => {
    Object.assign(message, attr);
  });
  navigator.serviceWorker.controller.postMessage(message);
}

export const injectStyle = (style) => {
  const blob = new Blob([style], { type: "text/css" });
  const blobURL = URL.createObjectURL(blob);
  const linkElem = document.createElement("link");
  linkElem.rel = "stylesheet";
  linkElem.href = blobURL;
  document.head.appendChild(linkElem);
};

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

export const getUrlBlob = () => {
  const extractedContent = decodeURIComponent(
    window.location.hash.substring(1)
  );
  if (!extractedContent) return null;
  const blob = new Blob([extractedContent], { type: "application/javascript" });
  return blob;
};
