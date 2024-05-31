import { html, ifDefined, T } from "helpers";

import FormControls from "./form-controls.js";

const Input = {
  tag: "uix-input",
  props: {
    autofocus: T.boolean(),
    value: T.string(),
    placeholder: T.string(),
    name: T.string(),
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
  ...FormControls("input"),
  render() {
    const {
      name,
      autofocus,
      value,
      change,
      placeholder,
      disabled,
      required,
      regex,
      type,
      keydown,
    } = this;
    return html`
      <div class="relative">
        <input
          type="text"
          id="filled"
          aria-describedby="filled_success_help"
          class=${this.theme("uix-input__element")}
          .value=${value || ""}
          ?autofocus=${autofocus}
          ?disabled=${disabled}
          ?required=${required}
          name=${ifDefined(name)}
          regex=${ifDefined(regex)}
          @keydown=${keydown}
          @change=${change}
          type=${type}
          placeholder=" "
        />
        <label for="filled" class=${this.theme("uix-input__label")}>
          ${placeholder}
        </label>
      </div>
    `;
  },
  theme: ({ cls, baseTheme }) => ({
    "uix-input__element": {
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
    "uix-input__label": {
      variant: baseTheme.BaseVariants,
      _base: cls([
        "absolute text-sm duration-300 transform -translate-y-4 scale-75 top-0.5 z-10 origin-[0] left-2.5",
        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
      ]),
    },
  }),
};

export default Input;
