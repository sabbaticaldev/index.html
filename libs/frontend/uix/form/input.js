import "../layout/container.js";
import "../content/text.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, ifDefined, T } from "helpers";

import FormControls from "./form-controls.js";

const InputSizes = ["sm", "md", "lg", "xl"];
const InputVariants = {
  default: `${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary}-200 text-${defaultTheme.colors.primary}`,
  secondary: `bg-${defaultTheme.colors.secondary}-200 text-${defaultTheme.colors.secondary}`,
  success: `bg-${defaultTheme.colors.success}-200 text-${defaultTheme.colors.success}`,
  danger: `bg-${defaultTheme.colors.error}-200 text-${defaultTheme.colors.error}`,
};

const formControlsConfig = FormControls("input");

class Input extends ReactiveView {
  static get properties() {
    return {
      autofocus: T.boolean(),
      value: T.string(),
      placeholder: T.string(),
      name: T.string(),
      label: T.string(),
      disabled: T.boolean(),
      regex: T.string(),
      required: T.boolean(),
      type: T.string({
        defaultValue: "text",
        enum: [
          "text",
          "password",
          "email",
          "number",
          "decimal",
          "search",
          "tel",
          "url",
        ],
      }),
      maxLength: T.number(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
      keydown: T.function(),
      change: T.function(),
      ...formControlsConfig.props,
    };
  }

  static theme = {
    "": "block",
    "[&:not([variant])]": InputVariants.default,
    ...genTheme(
      "variant",
      Object.keys(InputVariants),
      (entry) => InputVariants[entry],
    ),
    "[&:not([size])]": "p-3",
    ...genTheme(
      "size",
      InputSizes,
      (entry) =>
        `p-${
          entry === "sm"
            ? "2"
            : entry === "md"
            ? "3"
            : entry === "lg"
            ? "4"
            : "5"
        }`,
    ),
    ".input": "border-1",
    ".uix-input__label": "[&[required]]:after:content-['*'] after:text-red-600",
  };

  render() {
    const {
      name,
      autofocus,
      value,
      change,
      placeholder,
      label,
      disabled,
      required,
      regex,
      type,
      keydown,
    } = this;
    return html`
      <uix-container gap="xs">
        <label
          for=${ifDefined(name)}
          ?required=${required}
          class="uix-input__label"
        >
          <uix-text transform="uppercase" size="xs">${label}</uix-text>
        </label>
        <input
          type="text"
          id="filled"
          class="input"
          .value=${value || ""}
          ?autofocus=${autofocus}
          ?disabled=${disabled}
          ?required=${required}
          name=${ifDefined(name)}
          regex=${ifDefined(regex)}
          @keydown=${keydown}
          @change=${change}
          type=${type}
          placeholder=${placeholder}
        />
      </uix-container>
    `;
  }
}

Object.assign(Input, formControlsConfig);

export default ReactiveView.define("uix-input", Input);
