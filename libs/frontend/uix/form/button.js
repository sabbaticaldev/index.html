import { html, T } from "helpers";

const Button = {
  tag: "uix-button",
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
    baseTheme,
    borderRadius,
    ReverseVariants,
    ButtonSizes,
    TextSizes,
  }) => ({
    "uix-button__element": {
      _base: cls([
        "cursor-pointer transition ease-in-out duration-200 gap-2 w-full",
        baseTheme.flexCenter,
        baseTheme.fontStyles,
        borderRadius,
        "text-" + baseTheme.colors.button,
      ]),
      variant: ReverseVariants,
      size: [ButtonSizes, TextSizes],
    },
  }),
  render() {
    const btnTheme = "uix-button__element";

    if (this.dropdown) {
      return html`
        <details class="text-left" ?open=${this.dropdown === "open"}>
          ${this.href
            ? html`
                <summary data-theme=${btnTheme}>
                  <a href=${this.href}><slot></slot></a>
                </summary>
              `
            : html` <summary data-theme=${btnTheme}><slot></slot></summary> `}
          <slot name="dropdown"></slot>
        </details>
      `;
    }

    return this.href
      ? html`
          <a data-theme=${btnTheme} href=${this.href}>
            <slot></slot>
          </a>
        `
      : html`
          <button
            type=${this.type || "button"}
            data-theme=${btnTheme}
            @click=${(event) => this.click?.({ event, props: this })}
          >
            <slot></slot>
          </button>
        `;
  },
};

export default Button;
