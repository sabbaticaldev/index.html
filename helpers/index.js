import datetime from "./datetime.js";
import { draggable, droparea } from "./droparea.js";
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

export {
  datetime,
  debounce,
  draggable,
  droparea,
  event,
  get,
  i18n,
  patch,
  post,
  remove,
  T,
  url,
};
