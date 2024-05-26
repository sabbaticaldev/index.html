import { html, T } from "helpers";

/**
 * Card component documentation
 *
 * The Card component provides a flexible and extensible content container with multiple variants and slots.
 *
 * ## Usage
 *
 * ```html
 * <uix-card>
 *   <uix-card-header>Card Header</uix-card-header>
 *   <uix-card-body>Card Body</uix-card-body>
 *   <uix-card-footer>Card Footer</uix-card-footer>
 * </uix-card>
 * ```
 *
 * ## Props
 *
 * - `variant`: The variant of the card. Possible values are "default", "primary", "secondary", etc.
 * - `spacing`: The spacing of the card content. Possible values are "sm", "md", "lg", etc. Default is "md".
 *
 * ## Slots
 *
 * - `default`: The content of the card.
 *
 * ## Card Header
 *
 * The `<uix-card-header>` component represents the header section of the card.
 *
 * ### Slots
 *
 * - `default`: The content of the card header.
 *
 * ## Card Body
 *
 * The `<uix-card-body>` component represents the main content section of the card.
 *
 * ### Slots
 *
 * - `default`: The content of the card body.
 *
 * ## Card Footer
 *
 * The `<uix-card-footer>` component represents the footer section of the card.
 *
 * ### Slots
 *
 * - `default`: The content of the card footer.
 */
export default {
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
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
        <slot></slot>
      </div>
    `;
  },
};

export const CardHeader = {
  render() {
    return html`
      <div class=${this.theme("uix-card__header")}>
        <slot></slot>
      </div>
    `;
  },
};

export const CardBody = {
  render() {
    return html`
      <div class=${this.theme("uix-card__body")}>
        <slot></slot>
      </div>
    `;
  },
};

export const CardFooter = {
  render() {
    return html`
      <div class=${this.theme("uix-card__footer")}>
        <slot></slot>
      </div>
    `;
  },
};
