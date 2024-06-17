import "../layout/container.js";
import "./icon.js";

import { ReactiveView } from "frontend";
import { genTheme, html, T } from "helpers";

const TextColors = {
  primary: "text-blue-500",
  secondary: "text-gray-500",
  success: "text-green-500",
  danger: "text-red-500",
};

const FontWeight = ["thin", "light", "normal", "semibold", "bold", "black"];
const FontType = ["sans", "serif", "mono"];
const LeadingSizes = ["tight", "normal", "loose"];
const TrackingSizes = ["tighter", "normal", "wider"];
const TextSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
const TransformStyles = ["uppercase", "lowercase", "capitalize"];
const TextAlign = ["left", "center", "right", "start", "end", "justify"];

class Text extends ReactiveView {
  static get properties() {
    return {
      size: T.string({ defaultValue: "base" }),
      variant: T.string({ defaultValue: "default" }),
      weight: T.string({ defaultValue: "" }),
      font: T.string({ defaultValue: "sans" }),
      align: T.string(),
      transform: T.string(),
      leading: T.string(),
      tracking: T.string(),
      icon: T.string(),
    };
  }

  static theme = {
    ...genTheme(
      "variant",
      Object.keys(TextColors),
      (entry) => TextColors[entry],
    ),
    ...genTheme("weight", FontWeight, (entry) => `font-${entry}`),
    ...genTheme("font", FontType, (entry) => `font-${entry}`),
    ...genTheme("leading", LeadingSizes, (entry) => `leading-${entry}`),
    ...genTheme("size", TextSizes, (entry) => `text-${entry}`),
    ...genTheme("halign", TextAlign, (entry) => `text-${entry}`),
    ...genTheme("valign", TextAlign, (entry) => `text-${entry}`),
    ...genTheme("tracking", TrackingSizes, (entry) => `tracking-${entry}`),
    ...genTheme("transform", TransformStyles, (entry) => entry),
  };

  render() {
    return html`
      ${this.icon
        ? html`<uix-container horizontal items="center" gap="sm">
            <uix-icon name=${this.icon}></uix-icon><slot></slot>
          </uix-container>`
        : html`<slot></slot>`}
    `;
  }
}

export default ReactiveView.define("uix-text", Text);
