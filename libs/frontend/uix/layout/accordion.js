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

  _theme: {
    "": "divide-y divide-gray-800 block text-left",
    ".uix-accordion__summary": " list-none cursor-pointer block"
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
    return html`<uix-container padding="sm">
      ${this.items.map(
        (item, index) =>
          html`
            <details
              ?open=${item.open}
              @toggle=${(e) => this.handleToggle(e, index)}
            >
              <summary class="uix-accordion__summary">
                <uix-container horizontal items="center" justify="between">
                  <uix-text size="sm">
                    <uix-container horizontal items="center">
                      ${item.icon
                        ? html`<uix-icon name=${item.icon}></uix-icon>`
                        : ""}
                      ${item.label}
                    </uix-container>
                  </uix-text>
                  <uix-icon
                    name=${item.open ? "chevron-up" : "chevron-down"}
                  ></uix-icon>
                </uix-container>
              </summary>
              <uix-container>${item.content}</uix-container>
            </details>
          `,
      )}
    </uix-container> `;
  },
};
