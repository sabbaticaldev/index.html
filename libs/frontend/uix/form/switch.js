import { html, T } from "helpers";

import FormControls from "./form-controls.js";

export default {
  tag: "uix-switch",
  props: {
    checked: T.boolean(),
    disabled: T.boolean(),
    change: T.function(),
  },
  ...FormControls("input"),
  render() {
    const { checked, disabled } = this;
    return html`
      <button
        type="button"
        role="switch"
        data-theme="uix-switch"
        ?disabled=${disabled}
        @click=${() => this.setChecked(!checked)}
      >
        <input
          type="checkbox"
          data-theme="uix-switch__input"
          .checked=${checked}
        />
        <span
          data-theme="uix-switch__toggle"
          class=${checked ? "translate-x-6" : ""}
        ></span>
      </button>
    `;
  },
  theme: ({ baseTheme }) => ({
    "uix-switch": {
      _base: "focus:outline-none",
      variant: baseTheme.BaseVariants,
    },
    "uix-switch__input": "sr-only",
    "uix-switch__toggle": {
      _base:
        "inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200",
      checked: {
        true: "translate-x-6",
      },
    },
  }),
};
