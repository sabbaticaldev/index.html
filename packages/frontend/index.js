export { default as bootstrap } from "./bootstrap.js";
export * as CSV from "./helpers/csv.js";
export { default as datetime } from "./helpers/datetime.js";
export { draggable, droparea } from "./helpers/droparea.js";
export * as File from "./helpers/file.js";
export { get, patch, post, remove } from "./helpers/rest.js";
export { defaultTheme } from "./helpers/theme.js";
export { stringToType, T, TYPE_MAP } from "./helpers/types.js";
export { css, html, LitElement } from "./libs/lit.js";
export { ifDefined } from "./libs/lit.js";
export { createRef, ref } from "./libs/lit.js";
export { repeat } from "./libs/lit.js";
export { unsafeHTML } from "./libs/lit.js";
export { until } from "./libs/lit.js";
export { html as staticHtml } from "./libs/lit.js";
export { unsafeStatic } from "./libs/lit.js";
export { default as ReactiveView } from "./reactive-view/base.js";

export function escapeHTML(html = "") {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const genTheme = (attribute, options, handler, opts = {}) => {
  const { string } = opts;
  const styles = {};
  options.forEach((option) => {
    styles[`[&[${attribute}='${option}']]`] = handler(option);
  });
  return string
    ? Object.keys(styles)
        .map((key) =>
          styles[key]
            .split(" ")
            .filter(Boolean)
            .map((value) => `${key}:${value}`),
        )
        .flat()
        .join(" ")
    : styles;
};

export const spacingMap = {
  xs: "1", // corresponds to 0.25rem (4px)
  sm: "2", // corresponds to 0.5rem (8px)
  md: "4", // corresponds to 1rem (16px)
  base: "4",
  lg: "6", // corresponds to 1.5rem (24px)
  xl: "8", // corresponds to 2rem (32px)
  "2xl": "10", // corresponds to 2.5rem (40px)
  "3xl": "12", // corresponds to 3rem (48px)
  "4xl": "16", // corresponds to 4rem (64px)
};

export const sizeMap = {
  xs: "10",
  sm: "20",
  md: "40",
  base: "40",
  lg: "64",
  xl: "80",
  "2xl": "96",
  "3xl": "128",
  "4xl": "192",
};

export const widthMap = {
  xs: "w-[320px]",
  sm: "w-[640px]",
  md: "w-[768px]",
  lg: "w-[1024px]",
  xl: "w-[1280px]",
  "2xl": "w-[1536px]",
  "3xl": "w-[1920px]",
  "4xl": "w-[2560px]",
  full: "w-full",
};

export const sizeKeys = Object.keys(sizeMap);
export const sizeArray = ["min", "max", "fit", "screen", "full", "auto"];
