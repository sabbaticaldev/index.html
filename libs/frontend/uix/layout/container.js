import { html, T } from "helpers";

const Container = {
  tag: "uix-container",
  props: {
    width: T.string({ defaultValue: "full" }),
    height: T.string({ defaultValue: "auto" }),
    align: T.string({ defaultValue: "stretch" }),
    flex: T.boolean({ defaultValue: true }),
    justify: T.string(),
    padding: T.string({ defaultValue: "4" }),
    secondary: T.boolean({ defaultValue: false }),
    horizontal: T.boolean(),
    responsive: T.boolean(),
    reverse: T.boolean(),
    droparea: T.boolean(),
    grow: T.boolean(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    wrap: T.string({ defaultValue: "nowrap" }),
    rounded: T.boolean(),
  },
  _theme: {
    "": "flex",
    "[&:not([horizontal])]": "flex-col"
  },
  render() {
    return html`<slot></slot>`;
  },
};

export default Container;
