import "../layout/container.js";
import "../content/text.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, ifDefined, T } from "frontend";

import FormControls from "./form-controls.js";

const InputSizes = ["sm", "md", "lg", "xl"];
const InputVariants = {
  default: `${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary}-200 text-${defaultTheme.colors.primary}`,
  secondary: `bg-${defaultTheme.colors.secondary}-200 text-${defaultTheme.colors.secondary}`,
  success: `bg-${defaultTheme.colors.success}-200 text-${defaultTheme.colors.success}`,
  danger: `bg-${defaultTheme.colors.error}-200 text-${defaultTheme.colors.error}`,
};

class Input extends FormControls(ReactiveView, "input") {
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
      input: T.function(),
    };
  }
  static theme = {
    "": `flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
    "[&:not([variant])]": InputVariants.default,
    ...genTheme(
      "variant",
      Object.keys(InputVariants),
      (entry) => InputVariants[entry],
    ),
    ".uix-input__input": `w-full h-full ${genTheme(
      "size",
      InputSizes,
      (entry) =>
        `p-${
          entry === "sm"
            ? "1"
            : entry === "md"
            ? "2"
            : entry === "lg"
            ? "3"
            : "4"
        }`,
      { string: true },
    )}`,
    ".uix-input__label":
      "[&[required]]:after:content-['*'] after:text-red-600 absolute -mt-3 bg-white ml-3 px-3",
    "uix-input__container": "relative",
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
      input,
      size,
    } = this;
    return html`
      <uix-container width="full" class="uix-input__container">
        ${label
          ? html`<label
              for=${ifDefined(name)}
              ?required=${required}
              class="uix-input__label"
            >
              <uix-text transform="uppercase" size="xs">${label}</uix-text>
            </label>`
          : ""}
        <input
          type="text"
          id="filled"
          class="uix-input__input"
          .value=${value || ""}
          ?autofocus=${autofocus}
          ?disabled=${disabled}
          size=${size}
          ?required=${required}
          name=${ifDefined(name)}
          regex=${ifDefined(regex)}
          @keydown=${ifDefined(keydown)}
          @input=${ifDefined(input)}
          @change=${ifDefined(change)}
          type=${type}
          placeholder=${placeholder}
        />
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-input", Input);
