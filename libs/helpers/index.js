import * as CSV from "./csv.js";
import datetime from "./datetime.js";
import { draggable, droparea } from "./droparea.js";
import * as File from "./file.js";
import i18n from "./i18n.js";
import { get, patch, post, remove } from "./rest.js";
import { T } from "./types.js";
import url from "./url.js";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function event(type, ...attrs) {
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

export {
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
  url,
};
