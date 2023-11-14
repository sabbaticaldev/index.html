import { T } from "./types.js";
import { get, post, patch, remove } from "./rest.js";
import { droparea, draggable } from "./droparea.js";
import datetime from "./datetime.js";
import url from "./url.js";
import i18n from "./i18n.js";

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

export {
  event,
  debounce,
  T,
  i18n,
  get,
  post,
  patch,
  remove,
  droparea,
  draggable,
  datetime,
  url,
};
