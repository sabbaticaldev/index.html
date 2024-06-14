import { html, T, genTheme, sizeMap, spacingMap, defaultTheme } from "helpers";

const alignItems = ['start', 'center', 'end', 'baseline', 'stretch'];
const widths = ['min', 'max', 'fit', 'screen', 'full', 'auto'];
const widthSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const heights = ['min', 'max', 'fit', 'screen', 'full', 'auto'];
const heightSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const justifyOptions = ['start', 'center', 'end', 'between', 'around', 'evenly'];
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
    ...genTheme('width', widths, (entry) => `w-${entry}`),
    ...genTheme('width', widthSizes, (entry) => {
      return "w-" + sizeMap[entry];
    }),
    ...genTheme('height', heights, (entry) => `h-${entry}`),
    ...genTheme('height', heightSizes, (entry) => {
      return "h-"+ sizeMap[entry];
    }),
    ...genTheme('justify', justifyOptions, (entry) => `justify-${entry}`),
    ...genTheme('padding', Object.keys(sizeMap), (entry) => `p-${spacingMap[entry]}`),
    ...genTheme('spacing', Object.keys(sizeMap), (entry) => `space-y-${spacingMap[entry]} space-x-${spacingMap[entry]}`),
    ...genTheme('gap', Object.keys(sizeMap), (entry) => `gap-${spacingMap[entry]}`),
    ...genTheme('wrap', ['nowrap', 'wrap', 'wrap-reverse'], (entry) => `flex-${entry}`),
  },

  render() {
    return html`<slot></slot>`;
  },
};

console.log(Container.theme)
export default Container;
