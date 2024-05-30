import { html, staticHtml, T, unsafeStatic } from "helpers";

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

  tag: "uix-text",
const Text = {
  props: {
    size: T.string({}),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
    href: T.string(),
    onclick: T.function(),
    leading: T.string({}),
  },
  theme: ({
    TextColors,
    FontWeight,
    FontType,
    LeadingSizes,
    TrackingSizes,
    TextSizes,
  }) => ({
    "uix-text": {
      _base: "",
      variant: TextColors,
      weight: FontWeight,
      font: FontType,
      leading: LeadingSizes,
      size: [LeadingSizes, TrackingSizes, TextSizes],
    },
  }),
  render() {
    const { size } = this;
    const isLink = Boolean(this.onclick || this.href);
    const tag = isLink ? "a" : TAG_MAP[size] || "p";

    return isLink
      ? html`<a href=${this.href || "#"} @click=${this.onclick}
          ><slot></slot
        ></a>`
      : staticHtml`
      <${unsafeStatic(tag)} class="${unsafeStatic(
          `${this.theme("uix-text")}`,
        )}">
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};

export default Text;
