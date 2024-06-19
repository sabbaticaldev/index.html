import "../layout/container.js";
import "../content/icon.js";

import { ReactiveView } from "frontend";
import {
  defaultTheme,
  genTheme,
  html,
  sizeArray,
  sizeKeys,
  sizeMap,
  spacingMap,
  T,
} from "frontend";

const Variants = {
  default: `bg-${defaultTheme.colors.default}-300 ${defaultTheme.defaultTextColor}`,
  primary: `bg-${defaultTheme.colors.primary} text-${defaultTheme.colors.button}`,
  secondary: `bg-${defaultTheme.colors.secondary} ${defaultTheme.secondaryTextColor}`,
  success: `bg-${defaultTheme.colors.success} text-${defaultTheme.colors.button}`,
  danger: `bg-${defaultTheme.colors.error} text-${defaultTheme.colors.button}`,
};

const renderButtonContent = (icon) => {
  return icon
    ? html`<uix-container justify="center" horizontal items="center" gap="sm">
        <uix-icon name=${icon}></uix-icon><slot></slot>
      </uix-container>`
    : html`<slot></slot>`;
};

class Button extends ReactiveView {
  static get properties() {
    return {
      size: T.string({ defaultValue: "md" }),
      width: T.string({ defaultValue: "md" }),
      variant: T.string({ defaultValue: "default" }),
      type: T.string({ defaultValue: "button" }),
      padding: T.string({ defaultValue: "sm" }),
      icon: T.string(),
      href: T.string(),
      onclick: T.function(),
    };
  }

  static theme = {
    "": `${defaultTheme.flexCenter} ${defaultTheme.fontStyles} ${defaultTheme.borderRadius} cursor-pointer transition ease-in-out duration-200 gap-2 hover:opacity-80`,
    ...genTheme("variant", Object.keys(Variants), (entry) => Variants[entry]),
    ...genTheme(
      "size",
      Object.keys(spacingMap).filter((entry) => entry !== "md"),
      (entry) => `p-${spacingMap[entry]} text-${entry}`,
    ),
    ...genTheme("width", sizeArray, (entry) => `w-${entry}`),
    ...genTheme(
      "width",
      Object.keys(sizeMap),
      (entry) => "w-" + sizeMap[entry],
    ),

    ...genTheme("padding", sizeKeys, (entry) => `p-${spacingMap[entry]}`),
    ".uix-button__element": "w-full text-center",
  };

  render() {
    return this.href
      ? html`
          <a href=${this.href} class="uix-button__element">
            ${renderButtonContent(this.icon)}
            <slot></slot>
          </a>
        `
      : html`
          <button
            class="uix-button__element"
            type=${this.type || "button"}
            @click=${(event) => this.onclick?.({ event, props: this })}
          >
            ${renderButtonContent(this.icon)}
          </button>
        `;
  }
}

export default ReactiveView.define("uix-button", Button);
