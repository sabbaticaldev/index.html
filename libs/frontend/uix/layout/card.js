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
  theme: ({ BaseVariants, SpacingSizes, baseTheme }) => ({
    "uix-card": {
      _base: `block shadow rounded-md overflow-hidden ${baseTheme.cardBackgroundColor}`,
      variant: BaseVariants,
      spacing: SpacingSizes,
    },
    "uix-card__header": "px-4 py-2 border-b",
    "uix-card__body": "p-4",
    "uix-card__footer": "px-4 py-2 bg-gray-50 border-t",
  }),
  render() {
    return html`
      ${this.header &&
      html` <div data-theme="uix-card__header">${this.header}</div> `}
      ${this.body &&
      html` <div data-theme="uix-card__body">${this.body}</div> `}

      <slot></slot>

      ${this.footer &&
      html` <div data-theme="uix-card__footer">${this.footer}</div> `}
    `;
  },
};
