import { html, T } from "helpers";

export default {
  tag: "uix-accordion",
  props: {
    multiple: T.boolean(),
    border: T.boolean(),
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
    "uix-accordion": "divide-y divide-gray-800 block text-left",
    "uix-accordion-item": { _base: "p-4", border: { true: "border-b" } },
    "uix-accordion-item__header":
      "flex justify-between items-center cursor-pointer",
  },
  handleToggle(event, index) {
    const open = event.target.open;
    if (!this.multiple && open) {
      this.items = this.items.map((item) => ({
        ...item,
        open: false,
      }));
      const themedElements = this.shadowRoot.querySelectorAll("details");
      themedElements.forEach((el, idx) => {
        if (idx !== index && !this.multiple && open) {
          el.open = false;
        }
      });
    }
    this.items[index].open = open;
    this.requestUpdate();
  },
  render() {
    return html`<uix-list vertical gap="" spacing="">
      ${this.items.map(
        (item, index) =>
          html`
            <details
              data-theme="uix-accordion-item"
              ?open=${item.open}
              @toggle=${(e) => this.handleToggle(e, index)}
            >
              <summary data-theme="uix-accordion-item__header">
                ${item.label}
                <uix-icon
                  name=${item.open ? "chevron-up" : "chevron-down"}
                ></uix-icon>
              </summary>
              <uix-list vertical gap="" spacing="">${item.content}</uix-list>
            </details>
          `,
      )}
    </uix-list> `;
  },
};
