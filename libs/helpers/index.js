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
export { defaultTheme } from "./theme.js";

export function escapeHTML(html = "") {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const genTheme = (attribute, options, handler) => {
  const styles = {};
  options.forEach(option => {
    styles[`[&[${attribute}='${option}']]`] = handler(option);
  });
  return styles;
};

export const spacingMap = {
  xs: '1',  // corresponds to 0.25rem (4px)
  sm: '2',  // corresponds to 0.5rem (8px)
  md: '4',  // corresponds to 1rem (16px)
  lg: '6',  // corresponds to 1.5rem (24px)
  xl: '8',  // corresponds to 2rem (32px)
  '2xl': '10', // corresponds to 2.5rem (40px)
  '3xl': '12', // corresponds to 3rem (48px)
  '4xl': '16' // corresponds to 4rem (64px)
};

export const sizeMap = {
  xs: '20',  // 80px
  sm: '40',  // 160px
  md: '64',  // 256px
  lg: '80',  // 320px
  xl: '96',  // 384px
  '2xl': '128', // 512px
  '3xl': '160', // 640px
  '4xl': '256' // 1024px
};
