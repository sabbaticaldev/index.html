import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const SelectOption = {
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
  theme: ({ cls, userTheme }) => ({
    "uix-select": {
      _base: cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        userTheme.defaultTextColor,
        userTheme.borderStyles,
        userTheme.borderWidth,
        userTheme.borderRadius,
      ]),
      active: {
        true: cls([userTheme.activeTextColor, "border-blue-500"]),
        false: cls([userTheme.defaultTextColor, userTheme.hoverBorder]),
      },
      variant: userTheme.BaseVariants,
      size: [userTheme.SpacingSizes, userTheme.TextSizes],
    },
  }),
};

export { Select, SelectOption };
