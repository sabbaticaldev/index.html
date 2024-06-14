import { html, T, genTheme, defaultTheme, sizeMap, spacingMap, sizeArray } from "helpers";

const Variants = {
  default: `bg-${defaultTheme.colors.default}-300 ${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary} text-${defaultTheme.colors.button}`,
  secondary: `bg-${defaultTheme.colors.secondary} ${defaultTheme.secondaryTextColor}`,
  success: `bg-${defaultTheme.colors.success} text-${defaultTheme.colors.button}`,
  danger: `bg-${defaultTheme.colors.error} text-${defaultTheme.colors.button}`,
};

const Button = {
  tag: "uix-button",
  props: {
    size: T.string(),
    width: T.string({ defaultValue: "sm" }),
    variant: T.string({ defaultValue: "default" }),
    type: T.string({ defaultValue: "button" }),
    href: T.string(),
    click: T.function(),
  },
  _theme: {
    "": `${defaultTheme.flexCenter} ${defaultTheme.fontStyles} ${defaultTheme.borderRadius} cursor-pointer transition ease-in-out duration-200 gap-2`,
    "[&:not([variant])]": Variants.default,
    ...genTheme('variant', Object.keys(Variants), (entry) => Variants[entry]),
    "[&:not([size])]": ["p-" + spacingMap.sm, "text-sm"].join(" "),
    ...genTheme('size', Object.keys(spacingMap).filter(entry => entry !== "md"), (entry) => `p-${spacingMap[entry]} text-${entry}`),
    "[&:not([width])]": "w-" + sizeMap.md,
    ...genTheme('width', sizeArray, (entry) => `w-${entry}`),
    ...genTheme('width', Object.keys(sizeMap), (entry) => "w-" + sizeMap[entry])
  },
  render() {
    return this.href
      ? html`
          <a href=${this.href}>
            <slot></slot>
          </a>
        `
      : html`
          <button
            type=${this.type || "button"}
            @click=${(event) => this.click?.({ event, props: this })}
          >
            <slot></slot>
          </button>
        `;
  },
};

export default Button;
