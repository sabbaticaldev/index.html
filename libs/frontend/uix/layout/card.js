import { ReactiveView } from "frontend";
import {
  defaultTheme,
  genTheme,
  html,
  sizeArray,
  sizeMap,
  spacingMap,
  T,
} from "helpers";

const BaseVariants = ["primary", "secondary", "success", "danger"];
const shadowOptions = {
  none: "shadow-none",
  sm: "shadow-sm",
  default: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};
const sizeKeys = Object.keys(sizeMap);

class Card extends ReactiveView {
  static get properties() {
    return {
      variant: T.string({ defaultValue: "default" }),
      spacing: T.string({ defaultValue: "md" }),
      shadow: T.string({ defaultValue: "default" }),
    };
  }

  static theme = {
    "": `${defaultTheme.borderRadius} ${defaultTheme.cardBackgroundColor} overflow-hidden block border`,
    ...genTheme(
      "variant",
      BaseVariants,
      (entry) =>
        `${defaultTheme.reverseVariants.bgVariation}-${entry} ${defaultTheme.reverseVariants.textVariation}-${entry}`,
    ),
    ...genTheme("padding", sizeKeys, (entry) => `p-${spacingMap[entry]}`),
    "[&:not([padding])]": `p-${spacingMap.md}`,
    "[&:not([shadow])]": "shadow",
    ...genTheme(
      "shadow",
      Object.keys(shadowOptions),
      (entry) => shadowOptions[entry],
    ),
    "[&:not([size])]": ["p-" + spacingMap.sm, "text-sm"].join(" "),
    ...genTheme(
      "size",
      sizeKeys.filter((entry) => entry !== "md"),
      (entry) => `p-${spacingMap[entry]} text-${entry}`,
    ),
    "[&:not([width])]": "w-" + sizeMap.md * 2,
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme("width", sizeKeys, (entry) => "w-" + sizeMap[entry] * 2),
  };

  render() {
    return html` <slot></slot> `;
  }
}

export default ReactiveView.define("uix-card", Card);
