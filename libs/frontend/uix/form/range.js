import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const Range = {
  tag: "uix-range",
  props: {
    variant: T.string(),
    min: T.number({ defaultValue: 0 }),
    value: T.array({ defaultValue: [0] }),
    max: T.number({ defaultValue: 100 }),
    step: T.number({ defaultValue: 1 }),
  },
  ...FormControls("range"),
  change(e) {
    const newValue = e.target.value;
    const index = e.target.dataset.index;
    const value = [...this.value];
    value[index] = newValue;
    this._setValue(value);
  },
  render() {
    const { min, max, value, step } = this;
    const isSingleValue = value.length === 1;

    return html`
      <div class="relative pt-1">
        <input
          data-theme="uix-range__input"
          type="range"
          @input=${this.change}
          min=${min}
          max=${max}
          step=${step}
          value=${value[0]}
          data-index="0"
          class=${isSingleValue ? "" : "pointer-events-none"}
        />
        ${!isSingleValue &&
        html`
          <input
            data-theme="uix-range__input"
            type="range"
            @input=${this.change}
            min=${min}
            max=${max}
            step=${step}
            value=${value[1]}
            data-index="1"
          />
        `}
      </div>
      <div data-theme="uix-range__labels">
        <span class="text-sm text-gray-600">${min}</span>
        <span class="text-sm text-gray-600">${max}</span>
      </div>
    `;
  },
  theme: ({ BaseVariants, TextSizes, SpacingSizes }) => ({
    "uix-range": {
      _base: "w-full",
      variant: BaseVariants,
      size: [SpacingSizes, TextSizes],
    },
    "uix-range__input":
      "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
    "uix-range__labels": "-mt-2 flex w-full justify-between",
  }),
};

export default Range;
