import { html, T } from "helpers";

const Button = {
  tag: "uix-button",
  props: {
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    type: T.string({ defaultValue: "button" }),
    href: T.string(),
    click: T.function(),
  },
  theme: ({
    cls,
    baseTheme,
    borderRadius,
    ReverseVariants,
    ButtonSizes,
    TextSizes,
    WidthSizes,
  }) => ({
    "uix-button": {
      _base: cls([
        "cursor-pointer transition ease-in-out duration-200 gap-2",
        baseTheme.flexCenter,
        baseTheme.fontStyles,
        borderRadius,
        "text-" + baseTheme.colors.button,
      ]),
      variant: ReverseVariants,
      size: [ButtonSizes, TextSizes, WidthSizes],
    },
  }),
  render() {
    const btnTheme = "uix-button";

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
