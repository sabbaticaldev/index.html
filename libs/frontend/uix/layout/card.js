import { html, T } from "helpers";

export default {
  tag: "uix-card",
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
    header: T.string(),
    body: T.string(),
    footer: T.string(),
  },
  theme: ({ BaseVariants, SpacingSizes }) => ({
    "uix-card": {
      _base: "shadow rounded-md overflow-hidden",
      variant: BaseVariants,
      spacing: SpacingSizes,
    },
    "uix-card__header": "px-4 py-2 border-b",
    "uix-card__body": "p-4",
    "uix-card__footer": "px-4 py-2 bg-gray-50 border-t",
  }),
  render() {
    return html`
      <div class=${this.theme("uix-card", { variant: this.variant })}>
        ${this.header &&
        html`
          <div class=${this.theme("uix-card__header")}>${this.header}</div>
        `}
        ${this.body &&
        html` <div class=${this.theme("uix-card__body")}>${this.body}</div> `}
        ${this.footer &&
        html`
          <div class=${this.theme("uix-card__footer")}>${this.footer}</div>
        `}
      </div>
    `;
  },
};
