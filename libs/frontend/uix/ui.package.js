import { html,   staticHtml, T, unsafeStatic } from "helpers";

const TAG_MAP = {
  "4xl": "h1",
  "3xl": "h2",
  "2xl": "h2",
  xl: "h2",
  lg: "h3",
  md: "h4",
  sm: "h5",
  xs: "h6",
};

const Avatar = {
  props: {
    src: T.string(),
    alt: T.string({ defaultValue: "" }),
    size: T.string({ defaultValue: "sm" }),
    placeholder: T.string({ defaultValue: "" }),
  },
  render() {
    const { src, alt, placeholder } = this;
    let content;
    if (src) {
      content = html`<img src=${src} class=${this.theme("uix-avatar__img")} alt=${alt} />`;
    } else if (placeholder) {
      content = html`<span class=${this.theme("uix-avatar__img")}>${placeholder}</span>`;
    }

    return html`
      <div class=${this.theme("uix-avatar")}>${content}</div>
    `;
  },
};

const Badge = {
  props: {
    size: T.string({ defaultValue: "xs" }),
    variant: T.string({ defaultValue: "default" }),
    icon: T.string({ defaultValue: null }),
  },
  render() {
    return html`
      <span @click=${this.click} class=${this.theme("uix-badge")}>
        <slot></slot>
      </span>
    `;
  },
};

const Icon = {
  props: {
    name: T.string(),
    size: T.string({ defaultValue: "" }),
    containerClass: T.string(),
  },
  render() {
    const { name } = this;
    return html`<ion-icon name=${name} role="img"></ion-icon>`;
  },
};

const Loading = {
  props: {
    isVisible: T.boolean(),
    message: T.string({ defaultValue: null }),
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "primary" }),
  },
  render() {
    const { isVisible, message, type, size } = this;
    if (!isVisible) return html``;
    const Loading = {
      spinner: "loading loading-spinner",
      dots: "loading loading-dots",
      ring: "loading loading-ring",
      ball: "loading loading-ball",
      bars: "loading loading-bars",
      infinity: "loading loading-infinity",
    };
    const LoadingSize = {
      lg: "loading-lg",
      md: "loading-md",
      sm: "loading-sm",
      xs: "loading-xs",
    };

    const loadingClass = `${Loading[type]} ${LoadingSize[size]}`;

    return html`
      <span class="${loadingClass}">
        ${message ? html`<span>${message}</span>` : ""}
        ${message && type === "spinner" ? html`<uix-icon name="spinner"></uix-icon>` : ""}
      </span>
    `;
  },
};

const Text = {
  props: {
    size: T.string({}),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
    leading: T.string({}),
  },
  render() {
    const { size } = this;

    const tag = TAG_MAP[size] || "p";
    return staticHtml`
      <${unsafeStatic(tag)} class="${unsafeStatic(`${this.theme("uix-text")}`)}">
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};

export default {
  views: {
    "uix-avatar": Avatar,
    "uix-badge": Badge,
    "uix-icon": Icon,
    "uix-loading": Loading,
    "uix-text": Text,
  },
};
