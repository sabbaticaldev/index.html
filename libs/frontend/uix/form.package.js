import { css, html, T } from "helpers";

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
const theme = (userTheme, props) => ({
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
});

export default {
  i18n: {},
  theme,
  views: {
    "uix-icon-button": IconButton,
    "uix-button": Button,
    "uix-color-picker": ColorPicker,
  },
};
