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
    "uix-accordion": "divide-y divide-gray-200 block",
    "uix-accordion-item": "p-4",
    "uix-accordion-item__header":
      "flex justify-between items-center cursor-pointer",
    "uix-accordion-item__content": "p-4",
  },
  handleToggle(event, index) {
    const open = event.target.open;
    if (!this.allowMultiple && open) {
      this.items = this.items.map((item) => ({
        ...item,
        open: false,
      }));
      const themedElements = this.shadowRoot.querySelectorAll("details");
      themedElements.forEach((el, idx) => {
        if (idx !== index && !this.allowMultiple && open) {
          el.open = false;
        }
      });
    }
    this.items[index].open = open;
  },
  shouldUpdate() {
    if (this.stopUpdate) return false;
    else {
      this.stopUpdate = true;
      return true;
    }
  },
  render() {
    console.log("RUNNING");
    return html`
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
              <div data-theme="uix-accordion-item__content">
                ${item.content}
              </div>
            </details>
          `,
      )}
    `;
  },
};
