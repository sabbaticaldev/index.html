import {
  html,
  unsafeStatic,
  staticHtml,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";
import { T } from "../helpers/types.js";
import { droparea } from "../helpers/droparea.js";

export default {
  views: {
    "uix-block": {
      props: {
        variant: T.string(),
        spacing: T.string({ defaultValue: "md" }),
        containerClass: T.string(),
      },
      render: function () {
        const baseClass = this.generateTheme("uix-block");
        return html`
          <div class=${baseClass}>
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-list": {
      props: {
        vertical: T.boolean(),
        responsive: T.boolean(),
        tag: T.string({ defaultValue: "div" }),
        reverse: T.boolean(),
        droparea: T.boolean(),
        justify: T.string(),
        spacing: T.string({ defaultValue: "" }),
        gap: T.string({ defaultValue: "sm" }),
        full: T.boolean(),
        rounded: T.boolean(),
        containerClass: T.string(),
      },
      ...droparea,
      render: function () {
        const { tag } = this;
        const baseClass = this.generateTheme("uix-list");
        return staticHtml`
          <${unsafeStatic(tag)}            
            class="${unsafeStatic(baseClass)}">
            <slot></slot>
          </${unsafeStatic(tag)}>
        `;
      },
    },
    "uix-divider": {
      props: {
        label: T.string(),
        spacing: T.string({ default: "md" }),
      },
      render: function () {
        const { label } = this;
        return html`<div class=${this.generateTheme("uix-divider")}>
          <div class=${this.generateTheme("uix-divider__border")}></div>
          ${label &&
          html`<div class=${this.generateTheme("uix-divider__label")}>
              ${label}
            </div>
            <div class=${this.generateTheme("uix-divider__border")}></div>`}
        </div>`;
      },
    },
  },
};