import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const Range = {
  tag: "uix-range",
  props: {
    variant: T.string(),
    min: T.number({ defaultValue: 0 }),
    value: T.number({ defaultValue: 0 }),
    max: T.number({ defaultValue: 100 }),
  },
  ...FormControls("range"),
  render() {
    const { min, max, value } = this;
    return html`
      <input
        data-theme="uix-range__input"
        type="range"
        @input=${this.change}
        min=${min}
        max=${max}
        value=${value}
      />
      <div data-theme="uix-range__labels">
        <span class="text-sm text-gray-600">Squared</span>
        <span class="text-sm text-gray-600">Rounded</span>
      </div>
    `;
  },
  theme: ({ BaseVariants, TextSizes, SpacingSizes }) => ({
    "uix-range": {
      _base: "w-full",
      variant: BaseVariants,
      size: [SpacingSizes, TextSizes],
    },
    "uix-range__input": "w-full",
    "uix-range__labels": "-mt-2 flex w-full justify-between",
  }),
};

export default Range;
