import { html, T, genTheme, defaultTheme, sizeMap } from "helpers";

const AvatarSizes = ["xs", "sm", "md", "lg", "xl", "2xl"];
const AvatarVariants = {
  default: `bg-${defaultTheme.colors.default}-300 ${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary} text-${defaultTheme.colors.button}`,
  secondary: `bg-${defaultTheme.colors.secondary} ${defaultTheme.secondaryTextColor}`,
  success: `bg-${defaultTheme.colors.success} text-${defaultTheme.colors.button}`,
  danger: `bg-${defaultTheme.colors.error} text-${defaultTheme.colors.button}`,
};

const RoundedOptions = [
  "rounded-none",
  "rounded-sm",
  "rounded-md",
  "rounded",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
];

const Avatar = {
  tag: "uix-avatar",
  props: {
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    src: T.string(),
    alt: T.string(),
    border: T.boolean({ defaultValue: true }),
    rounded: T.string({ defaultValue: "rounded-full" }),
    presence: T.string(), // "online" or "offline"
    ring: T.boolean({ defaultValue: false }),
  },
  _theme: {
    "": "block overflow-hidden ring-offset-2 justify-center flex items-center",
    "[&:not([variant])]": AvatarVariants.default,
    ...genTheme('variant', Object.keys(AvatarVariants), (entry) => AvatarVariants[entry]),
    "[&:not([size])]": "w-10 h-10",
    ...genTheme('size', AvatarSizes, (entry) => `w-${sizeMap[entry]/2} h-${sizeMap[entry]/2}`),
    ...genTheme('rounded', RoundedOptions, (entry) => entry),
    "[&:not([rounded])]": "rounded-full",
    "[&[presence=online]]:before": "absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full",
    "[&[presence=offline]]:before": "absolute bottom-0 right-0 block w-2.5 h-2.5 bg-gray-500 border-2 border-white rounded-full",
    "[&[ring]]": "ring-2 ring-offset-2",
    ...genTheme('variant', Object.keys(AvatarVariants), (entry) => `ring-${defaultTheme.colors[entry]}`),
    ".uix-avatar__label": ""
  },
  render() {
    return html`
      ${this.src ? html`<img src=${this.src} style="width: 100%;" alt=${this.alt} />` : html`<uix-text weight="bold" size="xs"><slot></slot></uix-text>`}
    `;
  },
};

export default Avatar;
