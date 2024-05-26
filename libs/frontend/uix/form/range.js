import { html, T } from "helpers";

import FormControls from "./form-controls.js";

const Range = {
  props: {
    variant: T.string(),
    min: T.number({ defaultValue: 0 }),
    value: T.number({ defaultValue: 0 }),
    max: T.number({ defaultValue: 100 }),
  },
  ...FormControls("range"),
  render() {
    const { theme, min, max, value } = this;
    return html`
      <div class=${theme("uix-range")}>
        <input
          class=${theme("uix-range__input")}
          type="range"
          @input=${this.change}
          min=${min}
          max=${max}
          value=${value}
        />
        <div class=${theme("uix-range__labels")}>
          <span class="text-sm text-gray-600">Squared</span>
          <span class="text-sm text-gray-600">Rounded</span>
        </div>
      </div>
    `;
  },
  theme: ({ cls, userTheme }) => ({
    "uix-range": {
      _base: cls(["w-full"]),
      variant: userTheme.BaseVariants,
      size: [userTheme.SpacingSizes, userTheme.TextSizes],
    },
    "uix-range__input": "w-full",
    "uix-range__labels": "-mt-2 flex w-full justify-between",
  }),
};

export default Range;
