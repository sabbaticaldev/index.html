import { html, T, genTheme } from "helpers";

const TextColors = {
  primary: "text-blue-500",
  secondary: "text-gray-500",
  success: "text-green-500",
  danger: "text-red-500",
};

const baseVariants = {
  thin: "thin",
  extralight: "extralight",
  light: "light",
  normal: "normal",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
  extrabold: "extrabold",
  black: "black",
};

const FontWeight = ["thin", "light", "normal", "semibold", "bold", "black"];
const FontType = ["sans", "serif", "mono"];
const LeadingSizes = ["tight", "normal", "loose"];
const TrackingSizes = ["tighter", "normal", "wider"];
const TextSizes = ["sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
const TransformStyles = ["uppercase", "lowercase", "capitalize"];

const Text = {
  tag: "uix-text",
  props: {
    size: T.string({ defaultValue: "base" }),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
    transform: T.string(),
    leading: T.string(),
    tracking: T.string(),
  },
  _theme: {
    ...genTheme('variant', Object.keys(TextColors), (entry) => TextColors[entry]),
    ...genTheme('weight', FontWeight, (entry) => `font-${entry}`),
    ...genTheme('font', FontType, (entry) => `font-${entry}`),
    ...genTheme('leading', LeadingSizes, (entry) => `leading-${entry}`),
    ...genTheme('size', TextSizes, (entry) => `text-${entry}`),
    ...genTheme('tracking', TrackingSizes, (entry) => `tracking-${entry}`),
    ...genTheme('transform', TransformStyles, (entry) => entry),
  },
  render() {
    return html`
      <slot></slot>
    `;
  },
};

export default Text;