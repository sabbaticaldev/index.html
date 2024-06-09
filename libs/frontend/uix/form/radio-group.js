import { html, T } from "helpers";

import FormControls from "./form-controls.js";

export default {
  tag: "uix-radio-group",
  props: {
    name: T.string(),
    options: T.array(),
    value: T.object(),
    change: T.function(),
  },
  ...FormControls(""),
  render() {
    const { options, value, change } = this;
    return html`
      <div role="radiogroup">
        ${options.map(
          (option) => html`
            <label class="inline-flex items-center">
              <input
                type="radio"
                data-theme="uix-radio"
                value=${option.value}
                ?checked=${value === option.value}
                @change=${change}
                class="form-radio text-indigo-600 h-4 w-4"
              />
              <span class="ml-2 text-gray-700">${option.label}</span>
            </label>
          `,
        )}
      </div>
    `;
  },
  theme: ({ baseTheme }) => ({
    "uix-radio": {
      _base: "form-radio transition duration-150 ease-in-out",
      variant: baseTheme.BaseVariants,
      checked: {
        true: "bg-blue-600 border-transparent",
      },
      focus: {
        true: "outline-none shadow-outline-blue",
      },
    },
  }),
};
