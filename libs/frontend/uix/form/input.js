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

const Input = {
  tag: "uix-input",
  ...FormControls("input"),
  props: {
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
  },
  _theme: {
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
    ".uix-input__label": "[&[required]]:after:content-['*'] after:text-red-600",
  },
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
  },
};

export default Input;
