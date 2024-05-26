import { html, T } from "helpers";

/**
 * Button component
 *
 * The Button component is a customizable button with various props and slots.
 *
 * ## Usage
 *
 * ```html
 * <uix-button variant="primary">Click me</uix-button>
 * ```
 *
 * ## Props
 *
 * - `size`: The size of the button. Possible values are "sm", "md", "lg". Default is "md".
 * - `variant`: The variant of the button. Possible values are "default", "primary", "secondary", etc. Default is "default".
 * - `type`: The type of the button. Possible values are "button", "submit", "reset". Default is "button".
 * - `href`: If provided, the button will be rendered as an anchor tag with this href.
 * - `click`: A function to be called when the button is clicked.
 * - `dropdown`: If provided, the button will be rendered as a dropdown button. Possible values are "open", "hide".
 *
 * ## Slots
 *
 * - `default`: The content of the button.
 * - `dropdown`: The content of the dropdown menu, if the `dropdown` prop is used.
 */
const Button = {
  props: {
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    type: T.string({ defaultValue: "button" }),
    href: T.string(),
    click: T.function(),
    dropdown: T.string(),
  },
  theme: ({
    cls,
    userTheme,
    borderRadius,
    ReverseVariants,
    ButtonSizes,
    TextSizes,
  }) => ({
    "uix-button": {
      _base: cls([
        "cursor-pointer transition ease-in-out duration-200 gap-2 w-full",
        userTheme.flexCenter,
        userTheme.fontStyles,
        borderRadius,
        "text-" + userTheme.colors.button,
      ]),
      variant: ReverseVariants,
      size: [ButtonSizes, TextSizes],
    },
  }),
  render() {
    const btnClass = this.theme("uix-button");

    if (this.dropdown) {
      return html`
        <details class="text-left" ?open=${this.dropdown === "open"}>
          ${this.href
            ? html`
                <summary class=${btnClass}>
                  <a href=${this.href}><slot></slot></a>
                </summary>
              `
            : html` <summary class=${btnClass}><slot></slot></summary> `}
          <slot name="dropdown"></slot>
        </details>
      `;
    }

    return this.href
      ? html`
          <a
            class=${btnClass}
            href=${this.href}
            @click=${(event) => this.click?.({ event, props: this })}
          >
            <slot></slot>
          </a>
        `
      : html`
          <button
            type=${this.type || "button"}
            class=${btnClass}
            @click=${(event) => this.click?.({ event, props: this })}
          >
            <slot></slot>
          </button>
        `;
  },
};

export default Button;
