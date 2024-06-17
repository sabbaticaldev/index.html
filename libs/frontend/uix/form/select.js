import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, sizeMap, T } from "helpers";

import FormControls from "./form-controls.js";

const SelectVariants = {
  default: `${defaultTheme.defaultTextColor}`,
  primary: `border-${defaultTheme.colors.primary}-300 bg-${defaultTheme.colors.primary}-100 text-${defaultTheme.colors.primary}`,
  secondary: `border-${defaultTheme.colors.secondary}-300 bg-${defaultTheme.colors.secondary}-100 text-${defaultTheme.colors.secondary}`,
  success: `border-${defaultTheme.colors.success}-300 bg-${defaultTheme.colors.success}-100 text-${defaultTheme.colors.success}`,
  danger: `border-${defaultTheme.colors.error}-300 bg-${defaultTheme.colors.error}-100 text-${defaultTheme.colors.error}`,
};

const SelectSizes = ["xs", "sm", "md", "lg", "xl"];

const formControlsConfig = FormControls("select");

class Select extends ReactiveView {
  static get properties() {
    return {
      options: T.array(),
      value: T.string(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
      name: T.string(),
      ...formControlsConfig.props,
    };
  }

  static theme = {
    "": "block",
    ".uix-select__input": `border-1 ${
      defaultTheme.borderRadius
    } w-full h-full ${genTheme(
      "variant",
      Object.keys(SelectVariants),
      (entry) => SelectVariants[entry],
      { string: true },
    )}`,
    ...genTheme("size", SelectSizes, (entry) =>
      ["w-" + sizeMap[entry], "h-" + sizeMap[entry]].join(" "),
    ),
  };

  render() {
    const { name, options, value, change, variant, size } = this;
    return html`
      <select
        class="uix-select__input"
        name=${name}
        @change=${change}
        class="uix-select"
        .value=${value || ""}
        variant=${variant}
        size=${size}
      >
        ${options?.map(
          (option) =>
            html`<option value=${option.value}>${option.label}</option>`,
        ) || ""}
        <slot></slot>
      </select>
    `;
  }
}

Object.assign(Select, formControlsConfig);

export default ReactiveView.define("uix-select", Select);
