import { html, T, genTheme } from "helpers";
const alignItems = ['start', 'center', 'end', 'baseline', 'stretch'];
const Container = {
  tag: "uix-container",
  props: {
    width: T.string({ defaultValue: "full" }),
    height: T.string({ defaultValue: "auto" }),
    "align-items": T.string({ defaultValue: "center" }),
    justify: T.string(),
    padding: T.string({ defaultValue: "4" }),
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
    "[&:[rounded]]": "rounded-lg",
    "[&[secondary]]": "bg-gray-600",
    "[&[responsive]]": "md:flex-row md:items-center",
    "[&[reverse]]": "flex-row-reverse",
    "[&[grow]]": "flex-grow",
    ...genTheme('align-items', alignItems, (entry) => `items-${entry} w-full`)
  },

  render() {
    return html`<slot></slot>`;
  },
};

export default Container;
