import { css, droparea, html, staticHtml, T, unsafeStatic } from "helpers";

const Block = {
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
    containerClass: T.string(),
    full: T.boolean(),
  },
  render() {
    const baseClass = this.theme("uix-block");
    return html`
      <div class=${baseClass}>
        <slot></slot>
      </div>
    `;
  },
};

const List = {
  style: [
    css`
      :host {
        display: inherit;
      }
    `,
  ],
  props: {
    vertical: T.boolean(),
    responsive: T.boolean(),
    tag: T.string({ defaultValue: "div" }),
    reverse: T.boolean(),
    droparea: T.boolean(),
    justify: T.string(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    full: T.boolean(),
    rounded: T.boolean(),
    containerClass: T.string(),
  },
  ...droparea,
  render() {
    const { tag } = this;
    const baseClass = this.theme("uix-list");
    return staticHtml`
      <div class="flex-col"></div>
      <${unsafeStatic(tag)} class="${unsafeStatic(baseClass)}">
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};

const Divider = {
  props: {
    label: T.string(),
    spacing: T.string({ default: "md" }),
  },
  render() {
    const { label } = this;
    return html`
      <div class=${this.theme("uix-divider")}>
        <div class=${this.theme("uix-divider__border")}></div>
        ${label &&
        html`
          <div class=${this.theme("uix-divider__label")}>${label}</div>
          <div class=${this.theme("uix-divider__border")}></div>
        `}
      </div>
    `;
  },
};

export default {
  views: {
    "uix-block": Block,
    "uix-list": List,
    "uix-divider": Divider,
  },
};
