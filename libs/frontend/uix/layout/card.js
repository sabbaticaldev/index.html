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
const Card = {
  tag: "uix-card",
  props: {
    variant: T.string({ defaultValue: "default" }),
    spacing: T.string({ defaultValue: "md" }),
    shadow: T.string({ defaultValue: "default" }),
  },
  _theme: {
    "": `${defaultTheme.borderRadius} ${defaultTheme.cardBackgroundColor} overflow-hidden block border`,
    ...genTheme(
      "variant",
      BaseVariants,
      (entry) =>
        `${defaultTheme.reverseVariants.bgVariation}-${entry} ${defaultTheme.reverseVariants.textVariation}-${entry}`,
    ),
    ...genTheme(
      "padding",
      Object.keys(spacingMap),
      (entry) => `p-${spacingMap[entry]}`,
    ),
    "[&:not([padding]]": spacingMap.md,
    "[&:not([shadow])]": "shadow",
    ...genTheme(
      "shadow",
      Object.keys(shadowOptions),
      (entry) => shadowOptions[entry],
    ),
    "[&:not([size])]": ["p-" + spacingMap.sm, "text-sm"].join(" "),
    ...genTheme(
      "size",
      Object.keys(spacingMap).filter((entry) => entry !== "md"),
      (entry) => `p-${spacingMap[entry]} text-${entry}`,
    ),
    "[&:not([width])]": "w-" + sizeMap.md * 2,
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme(
      "width",
      Object.keys(sizeMap),
      (entry) => "w-" + sizeMap[entry] * 2,
    ),
  },
  render() {
    return html` <slot></slot> `;
  },
};

export default Card;
