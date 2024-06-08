import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const RadioGroup = {
  tag: "uix-radio-group",
  props: {
    name: T.string(),
    options: T.array(),
    value: T.any(),
    change: T.function(),
  },
  ...FormControls(""),
  render() {
    const { name, options, value, change } = this;
    return html`
      <div role="radiogroup">
        ${options.map(
          (option) => html`
            <label class="inline-flex items-center">
              <input
                type="radio"
                name=${name}
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
  theme: {
    "uix-radio-group": "space-y-2",
    "uix-radio-group__option": "flex items-center",
    "uix-radio-group__input": "mr-2",
    "uix-radio-group__label": "",
  },
};

export default RadioGroup;
