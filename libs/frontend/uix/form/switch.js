import { css, html, T } from "helpers";

import FormControls from "./form-controls.js";

const Switch = {
  tag: "uix-switch",
  style: css`
    .switch {
      @apply relative inline-flex h-6 w-11 items-center rounded-full;
    }
    .switch__input {
      @apply sr-only;
    }
    .switch__toggle {
      @apply inline-block h-4 w-4 transform rounded-full bg-white transition;
    }
    .switch__input:checked + .switch__toggle {
      @apply translate-x-6;
    }
  `,
  props: {
    checked: T.boolean(),
    disabled: T.boolean(),
    change: T.function(),
  },
  ...FormControls("input"),
  render() {
    const { checked, disabled, change } = this;
    return html`
      <button
        type="button"
        role="switch"
        class="switch"
        ?disabled=${disabled}
        @click=${() => this.setChecked(!checked)}
      >
        <input type="checkbox" class="switch__input" .checked=${checked} />
        <span class="switch__toggle"></span>
      </button>
    `;
  },
};

export default Switch;
