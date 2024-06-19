import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, T } from "frontend";

import FormControls from "./form-controls.js";
const DateInputVariants = {
  default: `bg-${defaultTheme.colors.default}-100 border-${defaultTheme.colors.default}-300 ${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary}-100 border-${defaultTheme.colors.primary}-300 text-${defaultTheme.colors.primary}`,
  secondary: `bg-${defaultTheme.colors.secondary}-100 border-${defaultTheme.colors.secondary}-300 text-${defaultTheme.colors.secondary}`,
  success: `bg-${defaultTheme.colors.success}-100 border-${defaultTheme.colors.success}-300 text-${defaultTheme.colors.success}`,
  danger: `bg-${defaultTheme.colors.error}-100 border-${defaultTheme.colors.error}-300 text-${defaultTheme.colors.error}`,
};

const DateInputSizes = ["sm", "md", "lg", "xl"];

class DateInput extends FormControls(ReactiveView, "date") {
  static get properties() {
    return {
      value: T.string(),
      min: T.string(),
      max: T.string(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
      change: T.function(),
    };
  }

  static theme = {
    "": "block w-full",
    ".uix-date-input__input": `appearance-none ${
      defaultTheme.borderRadius
    } rounded-md focus:outline-none focus:ring-2 focus:ring-${
      defaultTheme.colors.primary
    }-500 ${genTheme(
      "variant",
      Object.keys(DateInputVariants),
      (entry) => DateInputVariants[entry],
      { string: true },
    )}`,
    "[&:not([size])]": "py-2 px-3",
    ...genTheme(
      "size",
      DateInputSizes,
      (entry) =>
        `py-${
          entry === "sm"
            ? "1"
            : entry === "md"
            ? "2"
            : entry === "lg"
            ? "3"
            : "4"
        } px-${
          entry === "sm"
            ? "2"
            : entry === "md"
            ? "3"
            : entry === "lg"
            ? "4"
            : "5"
        }`,
    ),
  };

  render() {
    return html`
      <input
        class="uix-date-input__input"
        type="date"
        value=${this.value}
        min=${this.min}
        max=${this.max}
        @change=${this.change}
        variant=${this.variant}
        size=${this.size}
      />
    `;
  }
}

export default ReactiveView.define("uix-date-input", DateInput);
