import { html, ifDefined, T } from "helpers";

import FormControls from "./form-controls.js";

export default {
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
          data-theme="uix-input"
          aria-describedby="filled_success_help"
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
        <label for="filled" data-theme="uix-input__label">
          ${placeholder}
        </label>
      </div>
    `;
  },
  theme: ({ cls, baseTheme }) => ({
    
  }),
};
