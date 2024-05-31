import { html, T } from "helpers";

export default {
  tag: "uix-accordion",
  props: {
    allowMultiple: T.boolean(),
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        content: T.string(),
        open: T.boolean({ defaultValue: false }),
      },
    }),
  },

  theme: {
    "uix-accordion": "divide-y divide-gray-200",
    "uix-accordion-item": {
      _base: "py-4",
      open: { true: "bg-gray-50" },
    },
    "uix-accordion-item__header":
      "flex justify-between items-center cursor-pointer px-4",
    "uix-accordion-item__content": {
      _base: "px-4 pt-4",
      open: { true: "block", false: "hidden" },
    },
  },
  render() {
    return html`
      ${this.items.map(
    (item, index) =>
          html`
            <div
              class=${this.theme("uix-accordion-item", {
                open: Boolean(item.open),
  })}
            >
              <div
                class=${this.theme("uix-accordion-item__header")}
                @click=${() => this.setItemOpen(index, !item.open)}
              >
                ${item.label}
                <uix-icon
                  name=${item.open ? "chevron-up" : "chevron-down"}
                ></uix-icon>
              </div>
              <div
                class=${this.theme("uix-accordion-item__content", {
                  open: Boolean(item.open),
  })}
              >
                ${item.content}
              </div>
            </div>
          `,
  )}
    `;
  },
  setItemOpen(index, open) {
    const item = this.items[index];
    if (!this.allowMultiple) {
      this.items = this.items.map((i) => ({
        ...i,
        open: i === item ? open : false,
      }));
    } else {
      this.items[index].open = open;
      this.requestUpdate();
    }
  },
};
