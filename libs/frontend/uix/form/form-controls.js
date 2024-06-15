
import { html, T, genTheme, sizeMap, defaultTheme } from "helpers";

const InputVariants = {
  default: `checked:bg-${defaultTheme.colors.default}-600 checked:border-${defaultTheme.colors.default}-600`,
  primary: `border-${defaultTheme.colors.primary}-300 checked:bg-${defaultTheme.colors.primary}-600 checked:border-${defaultTheme.colors.primary}-600`,
  secondary: `border-${defaultTheme.colors.secondary}-300 checked:bg-${defaultTheme.colors.secondary}-600 checked:border-${defaultTheme.colors.secondary}-600`,
  success: `border-${defaultTheme.colors.success}-300 checked:bg-${defaultTheme.colors.success}-600 checked:border-${defaultTheme.colors.success}-600`,
  danger: `border-${defaultTheme.colors.error}-300 checked:bg-${defaultTheme.colors.error}-600 checked:border-${defaultTheme.colors.error}-600`,
};

const InputSizes = ["xs", "sm", "md", "lg", "xl"];

const FormControls = (element) => ({
  reportValidity() {
    const validity = this.$input?.reportValidity();
    this.$input?.classList.toggle("input-error", !validity);
    return validity;
  },
  change(e) {
    this._setValue(e.target.value);
  },
  _getValue() {
    return this.$input?.value || "";
  },
  _setValue(value) {
    this.$input.value = value;
    const formData = new FormData();
    formData.append(this.$input.name, value);
    setTimeout(() => {
      this._internals.setFormValue(formData);
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input,
      );
    }, 0);
  },
  formAssociated: true,
  firstUpdated() {
    this._defaultValue = this.value;
    this._internals = this.attachInternals();
    this.$input = this.q(["select", "textarea"].includes(element) ? element : "input");
    if (this.$input) {
      this._internals.setValidity(
        this.$input.validity,
        this.$input.validationMessage,
        this.$input,
      );
    }
  },
  formResetCallback() {
    if (!["submit", "button", "reset"].includes(this.$input.type))
      this.$input.value = this._defaultValue || "";
  },
  formDisabledCallback(disabled) {
    this.$input.disabled = disabled;
  },
  formStateRestoreCallback(state) {
    this.$input.value = state;
  },
  // Default Base Input

  props: {
    name: T.string(),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    checked: T.boolean(),
    value: T.boolean(),
    disabled: T.boolean(),
    onchange: T.function(),
  },
  _theme: {
    "": "block",
    ".uix-input__input": `before:content[''] border-gray-300 border-1 w-full h-full ${genTheme('variant', Object.keys(InputVariants), (entry) => InputVariants[entry], { string: true })}`,
    "[&:not([size])]": "w-4 h-4",
    ...genTheme('size', InputSizes, (entry) => ["w-" + sizeMap[entry]/4, "h-" + sizeMap[entry]/4].join(" ")),
  },
  _onchange(e) {
    const { onchange } = this;
    this.checked = !this.checked;
    this.$input.checked = this.checked;
    onchange?.(e);
  },
  render() {
    const { checked, disabled, name } = this;
    
    return html`
      <input
        class="uix-input__input"
        type=${element}
        name=${name}
        @change=${this._onchange}
        ?checked=${checked}
        ?disabled=${disabled}
      />
    `;
  },
});

export default FormControls;


