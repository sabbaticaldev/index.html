import "../layout/container.js";
import "../content/icon.js";

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

const Variants = {
  default: `bg-${defaultTheme.colors.default}-300 ${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary} text-${defaultTheme.colors.button}`,
  secondary: `bg-${defaultTheme.colors.secondary} ${defaultTheme.secondaryTextColor}`,
  success: `bg-${defaultTheme.colors.success} text-${defaultTheme.colors.button}`,
  danger: `bg-${defaultTheme.colors.error} text-${defaultTheme.colors.button}`,
};

const renderButtonContent = (icon) => {
  return icon
    ? html`<uix-container horizontal items="center" gap="sm">
        <uix-icon name=${icon}></uix-icon><slot></slot>
      </uix-container>`
    : html`<slot></slot>`;
};

class Button extends ReactiveView {
  static get properties() {
    return {
      size: T.string(),
      width: T.string({ defaultValue: "sm" }),
      variant: T.string({ defaultValue: "default" }),
      type: T.string({ defaultValue: "button" }),
      icon: T.string(),
      href: T.string(),
      click: T.function(),
    };
  }

  static theme = {
    "": `${defaultTheme.flexCenter} ${defaultTheme.fontStyles} ${defaultTheme.borderRadius} cursor-pointer transition ease-in-out duration-200 gap-2`,
    "[&:not([variant])]": Variants.default,
    ...genTheme("variant", Object.keys(Variants), (entry) => Variants[entry]),
    "[&:not([size])]": ["p-" + spacingMap.sm, "text-sm"].join(" "),
    ...genTheme(
      "size",
      Object.keys(spacingMap).filter((entry) => entry !== "md"),
      (entry) => `p-${spacingMap[entry]} text-${entry}`,
    ),
    "[&:not([width])]": "w-" + sizeMap.md,
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme(
      "width",
      Object.keys(sizeMap),
      (entry) => "w-" + sizeMap[entry],
    ),
  };

  render() {
    return this.href
      ? html`
          <a href=${this.href}>
            ${renderButtonContent(this.icon)}
            <slot></slot>
          </a>
        `
      : html`
          <button
            type=${this.type || "button"}
            @click=${(event) => this.click?.({ event, props: this })}
          >
            ${renderButtonContent(this.icon)}
          </button>
        `;
  }
}

export default ReactiveView.define("uix-button", Button);
