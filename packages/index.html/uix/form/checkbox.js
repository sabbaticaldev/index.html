import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, sizeMap, T } from "frontend";

import FormControls from "./form-controls.js";

const InputVariants = {
  default: `checked:bg-${defaultTheme.colors.default}-600 checked:border-${defaultTheme.colors.default}-600`,
  primary: `border-${defaultTheme.colors.primary}-300 checked:bg-${defaultTheme.colors.primary}-600 checked:border-${defaultTheme.colors.primary}-600`,
  secondary: `border-${defaultTheme.colors.secondary}-300 checked:bg-${defaultTheme.colors.secondary}-600 checked:border-${defaultTheme.colors.secondary}-600`,
  success: `border-${defaultTheme.colors.success}-300 checked:bg-${defaultTheme.colors.success}-600 checked:border-${defaultTheme.colors.success}-600`,
  danger: `border-${defaultTheme.colors.error}-300 checked:bg-${defaultTheme.colors.error}-600 checked:border-${defaultTheme.colors.error}-600`,
};

const InputSizes = ["xs", "sm", "md", "lg", "xl"];

class Checkbox extends FormControls(ReactiveView, "checkbox") {
  static element = "checkbox";
  static get properties() {
    return {
      name: T.string(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
      checked: T.boolean(),
      value: T.boolean(),
      disabled: T.boolean(),
      onchange: T.function(),
    };
  }
  static theme = {
    "": "block",
    ".uix-input__input": `before:content[''] border-gray-300 border-1 w-full h-full ${genTheme(
      "variant",
      Object.keys(InputVariants),
      (entry) => InputVariants[entry],
      { string: true },
    )}`,
    "[&:not([size])]": "w-4 h-4",
    ...genTheme("size", InputSizes, (entry) =>
      ["w-" + sizeMap[entry] / 4, "h-" + sizeMap[entry] / 4].join(" "),
    ),
  };
  _onchange(e) {
    const { onchange } = this;
    this.checked = !this.checked;
    this.$input.checked = this.checked;
    onchange?.(e);
  }
  render() {
    const { checked, disabled, name } = this;

    return html`
      <input
        class="uix-input__input"
        type=${this.constructor.element}
        name=${name}
        @change=${this._onchange}
        ?checked=${checked}
        ?disabled=${disabled}
      />
    `;
  }
}

ReactiveView.define("uix-checkbox", Checkbox);

export default Checkbox;
