import { html, T } from "helpers";

export default {
  props: {
    allowMultiple: T.boolean(),
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        content: T.string(),
        open: T.boolean(),
      },
    }),
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
      <div class=${this.theme("uix-accordion")}>
        ${this.items.map(
    (item) => html`
            <div class=${this.theme("uix-accordion-item", { open: item.open })}>
              <div
                class=${this.theme("uix-accordion-item__header")}
                @click=${() => this.setItemOpen(item, !item.open)}
              >
                ${item.label}
              </div>
              <div
                class=${this.theme("uix-accordion-item__content", {
    open: item.open,
  })}
              >
                ${item.content}
              </div>
            </div>
          `,
  )}
      </div>
    `;
  },
  setItemOpen(item, open) {
    if (!this.allowMultiple) {
      this.items = this.items.map((i) => ({
        ...i,
        open: i === item ? open : false,
      }));
    } else {
      item.open = open;
      this.requestUpdate();
    }
  },
};
