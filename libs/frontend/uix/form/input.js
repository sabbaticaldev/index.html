import { html, ifDefined, T } from "helpers";

import FormControls from "./form-controls.js";

const Input = {
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
          class=${this.theme("uix-input")}
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
  theme: ({ cls, userTheme }) => ({
    "uix-input": {
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
    "uix-input__label": {
      variant: userTheme.BaseVariants,
      _base: cls([
        "absolute text-sm duration-300 transform -translate-y-4 scale-75 top-0.5 z-10 origin-[0] left-2.5",
        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
      ]),
    },
  }),
};

export default Input;
