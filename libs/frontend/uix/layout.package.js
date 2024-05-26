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

const Accordion = {
  props: {
    allowMultiple: T.boolean(),
  },
  render() {
    return html`
      <div class=${this.theme("uix-accordion")}>
        <slot></slot>
      </div>
    `;
  },
};

const AccordionItem = {
  props: {
    label: T.string(),
    open: T.boolean(),
  },
  render() {
    return html`
      <div class=${this.theme("uix-accordion-item", { open: this.open })}>
        <div
          class=${this.theme("uix-accordion-item__header")}
          @click=${() => this.setOpen(!this.open)}
        >
          ${this.label}
        </div>
        <div
          class=${this.theme("uix-accordion-item__content", {
    open: this.open,
  })}
        >
          <slot></slot>
        </div>
      </div>
    `;
  },
};

const Card = {
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
  },
  render() {
    return html`
      <div class=${this.theme("uix-card", { variant: this.variant })}>
        <slot></slot>
      </div>
    `;
  },
};

const CardHeader = {
  render() {
    return html`
      <div class=${this.theme("uix-card__header")}>
        <slot></slot>
      </div>
    `;
  },
};

const CardBody = {
  render() {
    return html`
      <div class=${this.theme("uix-card__body")}>
        <slot></slot>
      </div>
    `;
  },
};

const CardFooter = {
  render() {
    return html`
      <div class=${this.theme("uix-card__footer")}>
        <slot></slot>
      </div>
    `;
  },
};

const Collapse = {
  props: {
    accordion: T.boolean(),
  },
  render() {
    return html`
      <div class=${this.theme("uix-collapse")}>
        <slot></slot>
      </div>
    `;
  },
};

const CollapseItem = {
  props: {
    label: T.string(),
    open: T.boolean(),
  },
  render() {
    return html`
      <div class=${this.theme("uix-collapse-item", { open: this.open })}>
        <div
          class=${this.theme("uix-collapse-item__header")}
          @click=${() => this.setOpen(!this.open)}
        >
          ${this.label}
        </div>
        <div
          class=${this.theme("uix-collapse-item__content", { open: this.open })}
        >
          <slot></slot>
        </div>
      </div>
    `;
  },
};

export default {
  views: {
    "uix-block": Block,
    "uix-list": List,
    "uix-divider": Divider,
    "uix-accordion": Accordion,
    "uix-accordion-item": AccordionItem,
    "uix-card": Card,
    "uix-card-header": CardHeader,
    "uix-card-body": CardBody,
    "uix-card-footer": CardFooter,
    "uix-collapse": Collapse,
    "uix-collapse-item": CollapseItem,
  },
};
