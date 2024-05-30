import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const SelectOption = {
  tag: "uix-select-option",
  props: {
    value: T.string(),
    label: T.string(),
  },
  render() {
    const { value, label } = this;
    return html` <option value=${value}>${label}</option> `;
  },
};

const Select = {
const Select = {
  tag: "uix-select",
  ...FormControls("select"),
  props: {
    options: T.array(),
    value: T.string(),
    variant: T.string({ defaultValue: "base" }),
    size: T.string({ defaultValue: "md" }),
    name: T.string(),
  },
  render() {
    const { name, options } = this;
    return html`
      <select
        name=${name}
        @change=${this.change}
        class=${this.theme("uix-select")}
      >
        ${options?.map((option) => html` <option>${option}</option> `) || ""}
        <slot></slot>
      </select>
    `;
  },
  theme: ({ cls, baseTheme }) => ({
    "uix-select": {
      _base: cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        baseTheme.defaultTextColor,
        baseTheme.borderStyles,
        baseTheme.borderWidth,
        baseTheme.borderRadius,
      ]),
      active: {
        true: cls([baseTheme.activeTextColor, "border-blue-500"]),
        false: cls([baseTheme.defaultTextColor, baseTheme.hoverBorder]),
      },
      variant: baseTheme.BaseVariants,
      size: [baseTheme.SpacingSizes, baseTheme.TextSizes],
    },
  }),
};

export { Select, SelectOption };
