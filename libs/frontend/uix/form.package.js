import { css, html, T } from "helpers";

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
    this.$input = this.q(element || "input");
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
});

const Textarea = {
  props: {
    value: T.string(),
    placeholder: T.string(),
    name: T.string(),
    disabled: T.boolean(),
    required: T.boolean(),
    autofocus: T.boolean(),
    rows: T.number({ defaultValue: 4 }),
    variant: T.string({ defaultValue: "bordered" }),
    size: T.string({ defaultValue: "md" }),
    input: T.function(),
    keydown: T.function(),
  },
  ...FormControls("textarea"),
  render() {
    const {
      autofocus,
      value,
      name,
      placeholder,
      disabled,
      rows,
      required,
      keydown,
    } = this;
    return html`
      <textarea
        class=${this.theme("uix-textarea")}
        placeholder=${placeholder}
        ?disabled=${disabled}
        name=${name}
        rows=${rows}
        ?autofocus=${autofocus}
        ?required=${required}
        @input=${this.change}
        @keydown=${keydown}
      >
${value}</textarea
      >
    `;
  },
};

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
    return html` <div class=${theme("uix-range")}>
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
    </div>`;
  },
};

const Checkbox = {
  style: [
    css`
      input[type="checkbox"] {
        clip-path: circle(46% at 50% 50%);
      }
    `,
  ],
  props: {
    name: T.string(),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    checked: T.boolean(),
    value: T.boolean(),
    disabled: T.boolean(),
    change: T.function(),
  },
  ...FormControls("toggle"),
  render() {
    const { checked, change, disabled, name } = this;
    return html`
      <input
        class=${this.theme("uix-checkbox")}
        type="checkbox"
        name=${name}
        @change=${function (e) {
    this.setChecked(e.target.checked);
    change?.(e);
  }}
        ?checked=${checked}
        ?disabled=${disabled}
      />
    `;
  },
};

const IconButton = {
  props: {
    icon: T.string(),
    variant: T.string(),
    size: T.string(),
    alt: T.string(),
  },
  render() {
    const { icon, alt } = this;
    return html`<button alt=${alt} class=${this.theme("uix-icon-button")}>
      <uix-icon
        class=${this.theme("uix-icon-button__icon")}
        name=${icon}
      ></uix-icon>
    </button>`;
  },
};

const Button = {
  props: {
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    type: T.string({ defaultValue: "button" }),
    href: T.string(),
    click: T.function(),
    dropdown: T.string(),
  },
  render() {
    const { type, click, href, dropdown } = this;
    const btnClass = this.theme("uix-button");

    if (dropdown) {
      return html` <details class="text-left" ?open=${dropdown === "open"}>
        ${(href &&
          html`<summary class=${btnClass}>
            <a href=${href}><slot></slot></a>
          </summary>`) ||
        ""}
        ${(!href && html`<summary class=${btnClass}><slot></slot></summary>`) ||
        ""}
        <slot name="dropdown"></slot>
      </details>`;
    }

    return href
      ? html`
          <a
            class=${btnClass}
            href=${href}
            @click=${(event) => click?.({ event, props: this })}
          >
            <slot></slot>
          </a>
        `
      : html`
          <button
            type=${type || "button"}
            class=${btnClass}
            @click=${(event) => click?.({ event, props: this })}
          >
            <slot></slot>
          </button>
        `;
  },
};

const ColorPicker = {
  props: {
    selectedColor: T.string(),
    colors: T.array({ defaultValue: [] }),
    colorKey: T.string(),
    updateTheme: T.function(),
    userTheme: T.object(),
  },
  render: function () {
    const { selectedColor, colors, colorKey, updateTheme, userTheme } = this;

    return html`
      <div class=${this.theme("uix-color-picker")}>
        ${colors.map(
    (color) =>
      html`
              <div
                class=${this.theme("uix-color-picker__color-block", {
    selectedColor,
  })}
              >
                <span
                  @click=${() =>
    updateTheme({
      ...userTheme,
      colors: { ...userTheme.colors, [colorKey]: color },
    })}
                  class=${this.theme("uix-color-picker__color", { color })}
                ></span>
                <div class=${this.theme("uix-color-picker__shades-container")}>
                  ${Array.from({ length: 9 }, (_, i) => i + 1).map(
    (shade) => html`
                      <span
                        @click=${() =>
    updateTheme({
      ...userTheme,
      colors: {
        ...userTheme.colors,
        [colorKey]: color,
      },
    })}
                        class=${this.theme("uix-color-picker__shade", {
    color,
    shade,
  })}
                      ></span>
                    `,
  )}
                </div>
              </div>
            `,
  )}
      </div>
    `;
  },
};
const theme = (userTheme, props) =>
  !console.log({ userTheme, props }) && {
    "uix-form-control": "form-control w-full",
    "uix-form-control__label": "label",
    "uix-form-control__label-text": "label-text",
    "uix-form-control__label-alt": "label-text-alt",
    "uix-input": {
      _base: props.cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        userTheme.defaultTextColor,
        userTheme.borderStyles,
        userTheme.borderWidth,
        props.borderRadius,
      ]),
      active: {
        true: props.cls([userTheme.activeTextColor, "border-blue-500"]),
        false: props.cls([userTheme.defaultTextColor, userTheme.hoverBorder]),
      },
      variant: props.BaseVariants,
      size: [props.SpacingSizes, props.TextSizes],
    },
    "uix-input__label": {
      variant: props.BaseVariants,
      _base: props.cls([
        "absolute text-sm duration-300 transform -translate-y-4 scale-75 top-0.5 z-10 origin-[0] left-2.5",
        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
      ]),
    },
    "uix-select": {
      _base: props.cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        userTheme.defaultTextColor,
        userTheme.borderStyles,
        userTheme.borderWidth,
        props.borderRadius,
      ]),
      active: {
        true: props.cls([userTheme.activeTextColor, "border-blue-500"]),
        false: props.cls([userTheme.defaultTextColor, userTheme.hoverBorder]),
      },
      variant: props.BaseVariants,
      size: [props.SpacingSizes, props.TextSizes],
    },
    "uix-textarea": {
      _base: props.cls([
        "block w-full appearance-none focus:outline-none focus:ring-0",
        userTheme.defaultTextColor,
        userTheme.borderStyles,
        userTheme.borderWidth,
        props.borderRadius,
      ]),
      active: {
        true: props.cls([userTheme.activeTextColor, "border-blue-500"]),
        false: props.cls([userTheme.defaultTextColor, userTheme.hoverBorder]),
      },
      variant: props.BaseVariants,
      size: [props.SpacingSizes, props.TextSizes],
    },
    "uix-range": {
      _base: props.cls(["w-full"]),
      variant: props.BaseVariants,
      size: [props.SpacingSizes, props.TextSizes],
    },
    "uix-range__input": "w-full",
    "uix-checkbox": {
      _base: props.cls([
        "before:content[''] peer before:transition-opacity hover:before:opacity-10 checked:opacity-100 opacity-30",
        props.ClipRoundedClasses[userTheme.borderRadius],
      ]),
      variant: props.ReverseVariants,
      size: props.DimensionSizes,
    },
    "uix-icon-button": {
      _base: props.cls([
        "transition ease-in-out duration-200 mx-auto",
        props.borderRadius,
      ]),
      variant: props.BaseVariants,
    },
    "uix-icon-button__icon": {
      _base: props.cls(["mx-auto"]),
      size: props.TextSizes,
    },
    "uix-button": {
      _base: props.cls([
        "cursor-pointer transition ease-in-out duration-200 gap-2 w-full",
        userTheme.flexCenter,
        userTheme.fontStyles,
        props.borderRadius,
        "text-" + userTheme.colors.button,
      ]),
      variant: props.ReverseVariants,
      size: [props.ButtonSizes, props.TextSizes],
    },
    "uix-color-picker": "grid grid-cols-14",
    "uix-color-picker__color-block": ({ selectedColor }) =>
      `group relative w-6 h-6 cursor-pointer ${
        selectedColor
          ? "scale-110"
          : "hover:scale-110 transform transition ease-out duration-150"
      }`,
    "uix-color-picker__color": ({ color }) =>
      `w-6 h-6 block ${props.generateColorClass(color, 500)}`,
    "uix-color-picker__color_options": props.ColorPickerClasses,
    "uix-color-picker__shades-container":
      "absolute left-0 mt-1 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto",
    "uix-color-picker__shade": ({ color, shade }) =>
      `w-6 h-6 block ${props.generateColorClass(color, shade * 100)}`,
  };

export default {
  i18n: {},
  theme,
  views: {
    "uix-textarea": Textarea,
    "uix-range": Range,
    "uix-checkbox": Checkbox,
    "uix-icon-button": IconButton,
    "uix-button": Button,
    "uix-color-picker": ColorPicker,
  },
};
