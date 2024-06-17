import "./text.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, sizeMap, T } from "helpers";

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

class Avatar extends ReactiveView {
  static get properties() {
    return {
      size: T.string({ defaultValue: "md" }),
      variant: T.string({ defaultValue: "default" }),
      src: T.string(),
      alt: T.string(),
      border: T.boolean({ defaultValue: true }),
      rounded: T.string({ defaultValue: "rounded-full" }),
      presence: T.string(), // "online" or "offline"
      ring: T.boolean({ defaultValue: false }),
    };
  }

  static theme = {
    "": "block overflow-hidden ring-offset-2 justify-center flex items-center",
    ...genTheme(
      "variant",
      Object.keys(AvatarVariants),
      (entry) => AvatarVariants[entry],
    ),
    ...genTheme(
      "size",
      AvatarSizes,
      (entry) => `w-${sizeMap[entry] / 2} h-${sizeMap[entry] / 2}`,
    ),
    ...genTheme("rounded", RoundedOptions, (entry) => entry),
    "[&[presence=online]]:before":
      "absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full",
    "[&[presence=offline]]:before":
      "absolute bottom-0 right-0 block w-2.5 h-2.5 bg-gray-500 border-2 border-white rounded-full",
    "[&[ring]]": "ring-2 ring-offset-2",
    ...genTheme(
      "variant",
      Object.keys(AvatarVariants),
      (entry) => `ring-${defaultTheme.colors[entry]}`,
    ),
  };

  render() {
    return html`
      ${this.src
        ? html`<img src=${this.src} style="width: 100%;" alt=${this.alt} />`
        : html`<uix-text weight="bold" size="xs"><slot></slot></uix-text>`}
    `;
  }
}

export default ReactiveView.define("uix-avatar", Avatar);
