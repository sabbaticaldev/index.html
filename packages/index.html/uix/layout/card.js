import { ReactiveView } from "frontend";
import {
  defaultTheme,
  genTheme,
  html,
  sizeArray,
  sizeMap,
  spacingMap,
  T,
} from "frontend";

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
      width: T.string({ defaultValue: "md" }),
    };
  }

  static theme = {
    "": `${defaultTheme.borderRadius} ${defaultTheme.cardBackgroundColor} overflow-hidden block border`,
    ...genTheme("padding", sizeKeys, (entry) => `p-${spacingMap[entry]}`),
    ...genTheme(
      "shadow",
      Object.keys(shadowOptions),
      (entry) => shadowOptions[entry],
    ),
    ...genTheme(
      "size",
      sizeKeys.filter((entry) => entry !== "md"),
      (entry) => `p-${spacingMap[entry]} text-${entry}`,
    ),
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme("width", sizeKeys, (entry) => "w-" + sizeMap[entry] * 2),
  };

  render() {
    return html` <slot></slot> `;
  }
}

export default ReactiveView.define("uix-card", Card);
