const Link = {
  tag: "uix-link",
  props: {
    href: T.string(),
    onclick: T.function(),
    size: T.string({ defaultValue: "md" }),
    variant: T.string(),
    weight: T.string(),
    font: T.string({ defaultValue: "sans" }),
    leading: T.string(),
  },
  theme: ({
    TextColors,
    FontWeight,
    FontType,
    TrackingSizes,
    LeadingSizes,
    TextSizes,
  }) => ({
    "uix-link": {
      transform: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
      weight: FontWeight,
      font: FontType,
      variant: TextColors,
      size: [LeadingSizes, TrackingSizes, TextSizes],
    },
  }),
  render() {
    return this.href
      ? html`<a href=${this.href} @click=${this.onclick} data-theme="uix-link">
          <slot></slot>
        </a>`
      : html`<button @click=${this.onclick} data-theme="uix-link">
          <slot></slot>
        </button>`;
  },
};

export default Link;
import { html, T } from "helpers";
