import { html, T } from "helpers";

/**
 * Accordion component documentation
 *
 * The Accordion component allows you to create a vertically stacked list of items that can expand/collapse.
 *
 * ## Usage
 *
 * ```html
 * <uix-accordion>
 *   <uix-accordion-item label="Item 1">
 *     <p>Content for item 1</p>
 *   </uix-accordion-item>
 *   <uix-accordion-item label="Item 2">
 *     <p>Content for item 2</p>
 *   </uix-accordion-item>
 * </uix-accordion>
 * ```
 *
 * ## Props
 *
 * - `allowMultiple`: A boolean indicating whether multiple accordion items can be open at the same time. Default is `false`.
 *
 * ## Slots
 *
 * - `default`: The content of the accordion, which should consist of `<uix-accordion-item>` elements.
 *
 * ## Accordion Item Props
 *
 * - `label`: The label text for the accordion item.
 * - `open`: A boolean indicating whether the accordion item is open by default. Default is `false`.
 *
 * ## Accordion Item Slots
 *
 * - `default`: The content of the accordion item, which is displayed when the item is expanded.
 */
export default {
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

export const AccordionItem = {
  props: {
    label: T.string(),
    open: T.boolean(),
  },
  theme: {
    "uix-accordion": "",
    "uix-accordion-item": {
      _base: "border-b border-gray-200",
      open: { true: "bg-gray-100" },
    },
    "uix-accordion-item__header": "p-4 cursor-pointer",
    "uix-accordion-item__content": {
      _base: "p-4",
      open: { true: "block", false: "hidden" },
    },
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
