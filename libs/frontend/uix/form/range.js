import "../layout/container.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, T } from "helpers";

import FormControls from "./form-controls.js";

const RangeVariants = {
  default: `bg-${defaultTheme.colors.default}-300`,
  primary: `bg-${defaultTheme.colors.primary}-500`,
  secondary: `bg-${defaultTheme.colors.secondary}-500`,
  success: `bg-${defaultTheme.colors.success}-500`,
  danger: `bg-${defaultTheme.colors.error}-500`,
};

const RangeSizes = ["sm", "md", "lg", "xl"];

const formControlsConfig = FormControls("range");

class Range extends ReactiveView {
  static get properties() {
    return {
      variant: T.string({ defaultValue: "default" }),
      min: T.number({ defaultValue: 0 }),
      value: T.array({ defaultValue: [0] }),
      max: T.number({ defaultValue: 100 }),
      step: T.number({ defaultValue: 1 }),
      size: T.string({ defaultValue: "md" }),
      ...formControlsConfig.props,
    };
  }

  static theme = {
    "": "block",
    ".uix-range__input": `appearance-none w-full h-4 rounded-full cursor-pointer ${
      RangeVariants.default
    } ${genTheme(
      "variant",
      Object.keys(RangeVariants),
      (entry) => RangeVariants[entry],
      { string: true },
    )}`,
    "[&:not([size])]": "h-2",
    ...genTheme(
      "size",
      RangeSizes,
      (entry) =>
        `h-${
          entry === "sm"
            ? "1"
            : entry === "md"
            ? "2"
            : entry === "lg"
            ? "3"
            : "4"
        }`,
    ),
    "uix-range__labels":
      "-mt-2 flex w-full justify-between text-sm text-gray-600",
  };

  change(e) {
    const newValue = e.target.value;
    const index = e.target.dataset.index;
    const value = [...this.value];
    value[index] = newValue;
    this._setValue(value);
  }

  render() {
    const { min, max, value, step, variant } = this;
    const isSingleValue = value && value.length === 1;
    return html`
      <uix-container horizontal>
        <input
          class="uix-range__input"
          type="range"
          @input=${this.change}
          min=${min}
          variant=${variant}
          max=${max}
          step=${step}
          value=${value?.[0]}
          data-index="0"
        />
        ${
          (value &&
            !isSingleValue &&
            html`
              <input
                class="uix-range__input"
                type="range"
                @input=${this.change}
                min=${min}
                max=${max}
                step=${step}
                variant=${variant}
                value=${value[1]}
                data-index="1"
                style="background: linear-gradient(to right, #E5E7EB 0%, #E5E7EB ${(value[0] /
                  max) *
                100}%, #3B82F6 ${(value[0] / max) * 100}%, #3B82F6 ${(value[1] /
                  max) *
                100}%, #E5E7EB ${(value[1] / max) * 100}%, #E5E7EB 100%);"
              />
            `) ||
          ""
        }
      </div>
      <div class="uix-range__labels">
        <span>${min}</span>
        <span>${max}</span>
        </uix-container>
    `;
  }
}

Object.assign(Range, formControlsConfig);

export default ReactiveView.define("uix-range", Range);
