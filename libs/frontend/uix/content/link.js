const Link = {
  tag: "uix-link",
  props: {
    href: T.string(),
    onclick: T.function(),
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
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
    "uix-link": {
      _base: "",
      variant: TextColors,
      weight: FontWeight,
      font: FontType,
      leading: LeadingSizes,
      size: [LeadingSizes, TrackingSizes, TextSizes],
    },
  }),
  render() {
    return this.href
      ? html`<a href=${this.href} data-theme="uix-link"><slot></slot></a>`
      : html`<button @click=${this.onclick} data-theme="uix-link">
          <slot></slot>
        </button>`;
  },
};

export default Link;
import { html, T } from "helpers";
