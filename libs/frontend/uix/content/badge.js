import { defaultTheme, genTheme, html, sizeMap, T } from "helpers";

const BadgeVariants = {
  default: `text-${defaultTheme.colors.default}-50 bg-${defaultTheme.colors.default}`,
  primary: `text-${defaultTheme.colors.primary}-50 bg-${defaultTheme.colors.primary}`,
  secondary: `text-${defaultTheme.colors.secondary}-50 bg-${defaultTheme.colors.secondary}`,
  success: `text-${defaultTheme.colors.success}-50 bg-${defaultTheme.colors.success}`,
  danger: `text-${defaultTheme.colors.error}-50 bg-${defaultTheme.colors.error}`,
};

const BadgeSizes = ["xs", "sm", "base", "lg", "xl"];

const Badge = {
  tag: "uix-badge",
  props: {
    size: T.string({ defaultValue: "xs" }),
    variant: T.string({ defaultValue: "default" }),
    icon: T.string(),
  },
  _theme: {
    "": `flex items-center font-semibold mr-2 p-1 rounded text-xs ${BadgeVariants.default}`,
    ...genTheme(
      "variant",
      Object.keys(BadgeVariants),
      (entry) => BadgeVariants[entry],
    ),
    ...genTheme("size", BadgeSizes, (entry) =>
      ["w-" + sizeMap[entry] / 2, "text-" + entry].join(" "),
    ),
  },
  render() {
    return html`
      ${this.icon ? html`<uix-icon name=${this.icon}></uix-icon>` : ""}
      <slot></slot>
    `;
  },
};

export default Badge;
