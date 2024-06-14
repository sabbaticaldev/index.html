import { html, T, genTheme, sizeMap, sizeArray, spacingMap, defaultTheme } from "helpers";

const alignItems = ['start', 'center', 'end', 'baseline', 'stretch'];
const justifyOptions = ['start', 'center', 'end', 'between', 'around', 'evenly'];
const sizeKeys = Object.keys(sizeMap);
const Container = {
  tag: "uix-container",
  props: {
    width: T.string({ defaultValue: "full" }),
    height: T.string({ defaultValue: "auto" }),
    items: T.string({ defaultValue: "center" }),
    justify: T.string({ default: "evenly" }),
    padding: T.string({ defaultValue: "md" }),
    secondary: T.boolean(),
    horizontal: T.boolean(),
    responsive: T.boolean(),
    reverse: T.boolean(),
    grow: T.boolean(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    wrap: T.string({ defaultValue: "nowrap" }),
    rounded: T.boolean(),
  },
  _theme: {
    "": "flex",
    "[&:not([horizontal])]": "flex-col",
    "[&[rounded]]": defaultTheme.borderRadius,
    "[&[secondary]]": [defaultTheme.backgroundSecondaryColor, defaultTheme.secondaryTextColor].join(" "),
    "[&[responsive]]": "md:flex-row md:items-center",
    "[&[reverse]]": "flex-row-reverse",
    "[&[grow]]": "flex-grow",
    ...genTheme('items', alignItems, (entry) => `items-${entry}`),
    ...genTheme('width', sizeArray, (entry) => `w-${entry}`),
    ...genTheme('width', sizeKeys, (entry) => {
      return "w-" + sizeMap[entry];
    }),
    ...genTheme('height', sizeArray, (entry) => `h-${entry}`),
    ...genTheme('height', sizeKeys, (entry) => {
      return "h-"+ sizeMap[entry];
    }),
    ...genTheme('justify', justifyOptions, (entry) => `justify-${entry}`),
    ...genTheme('padding', sizeKeys, (entry) => `p-${spacingMap[entry]}`),
    ...genTheme('spacing', sizeKeys, (entry) => `space-y-${spacingMap[entry]} space-x-${spacingMap[entry]}`),
    ...genTheme('gap', sizeKeys, (entry) => `gap-${spacingMap[entry]}`),
    "[&[gap='stack']]": "-space-x-4",
    ...genTheme('wrap', ['nowrap', 'wrap', 'wrap-reverse'], (entry) => `flex-${entry}`),
  },

  render() {
    return html`<slot></slot>`;
  },
};

export default Container;
