import { ReactiveView } from "frontend";
import {
  defaultTheme,
  genTheme,
  html,
  sizeArray,
  sizeMap,
  spacingMap,
  T,
  widthMap,
} from "frontend";

const alignItems = ["start", "center", "end", "baseline", "stretch"];
const justifyOptions = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
];

const positions = ["sticky", "fixed", "static", "absolute", "relative"];
const sizeKeys = Object.keys(sizeMap);

class Container extends ReactiveView {
  static get properties() {
    return {
      width: T.string(),
      height: T.string(),
      items: T.string(),
      justify: T.string(),
      padding: T.string(),
      secondary: T.boolean(),
      horizontal: T.boolean(),
      responsive: T.boolean(),
      "max-resolution": T.string(),
      reverse: T.boolean(),
      grow: T.boolean(),
      spacing: T.string(),
      gap: T.string(),
      wrap: T.string(),
      rounded: T.boolean(),
    };
  }

  static theme = {
    "": "flex",
    "[&:not([horizontal])]": "flex-col",
    "[&[rounded]]": defaultTheme.borderRadius,
    "[&[secondary]]": [
      defaultTheme.backgroundSecondaryColor,
      defaultTheme.secondaryTextColor,
    ].join(" "),
    "[&[responsive]]": "md:flex-row md:items-center",
    "[&[reverse]]": "flex-row-reverse",
    "[&[grow]]": "flex-grow",
    ...genTheme("items", alignItems, (entry) => `items-${entry}`),
    ...genTheme(
      "max-resolution",
      Object.keys(widthMap),
      (entry) => `max-${widthMap[entry]} m-auto overflow-hidden`,
    ),
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme("width", sizeKeys, (entry) => `w-${sizeMap[entry]}`),
    ...genTheme("height", sizeArray, (entry) => `h-${entry}`),
    ...genTheme("height", sizeKeys, (entry) => `h-${sizeMap[entry]}`),
    ...genTheme("position", positions, (entry) => entry),
    ...genTheme("justify", justifyOptions, (entry) => `justify-${entry}`),
    ...genTheme("padding", sizeKeys, (entry) => `p-${spacingMap[entry]}`),
    ...genTheme(
      "spacing",
      sizeKeys,
      (entry) => `space-y-${spacingMap[entry]} space-x-${spacingMap[entry]}`,
    ),
    ...genTheme("gap", sizeKeys, (entry) => `gap-${spacingMap[entry]}`),
    "[&[gap='stack']]": "-space-x-4",
    ...genTheme(
      "wrap",
      ["nowrap", "wrap", "wrap-reverse"],
      (entry) => `flex-${entry}`,
    ),
  };

  render() {
    return html`<slot></slot>`;
  }
}

export default ReactiveView.define("uix-container", Container);
