export * as CSV from "./csv.js";
export { default as datetime } from "./datetime.js";
export { draggable, droparea } from "./droparea.js";
export * as File from "./file.js";
export { default as hash } from "./hash.js";
export { default as i18n } from "./i18n.js";
export { default as querystring } from "./querystring.js";
export { get, patch, post, remove } from "./rest.js";
export {
  debounce,
  event,
  getState,
  setState,
  subscribe,
  unsubscribe,
} from "./state.js";
export { stringToType, T, TYPE_MAP } from "./types.js";
export { default as url } from "./url.js";
// Exporting lit functions and directives to be used in the *.package.js and components using the frontend framework.
// If you need any Lit function from helpers, add and export it here
export { css, html, LitElement } from "lit";
export { ifDefined } from "lit/directives/if-defined.js";
export { createRef, ref } from "lit/directives/ref.js";
export { repeat } from "lit/directives/repeat.js";
export { unsafeHTML } from "lit/directives/unsafe-html.js";
export { until } from "lit/directives/until.js";
export { html as staticHtml } from "lit/static-html.js";
export { unsafeStatic } from "lit/static-html.js";
export function escapeHTML(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
