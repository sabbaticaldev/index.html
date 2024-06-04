import { html, T } from "helpers";

export default {
  tag: "uix-dropdown",
  props: {
    open: T.boolean({ defaultValue: false }),
    label: T.string(),
    icon: T.string(),
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        click: T.function(),
      },
    }),
  },
  theme: {
    "uix-dropdown": "relative inline-block",
    "uix-dropdown__button": "inline-flex items-center",
    "uix-dropdown__panel":
      "absolute right-0 mt-2 w-56 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10",
    "uix-dropdown__item":
      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
  },
  render() {
    return html`
      <div data-theme="uix-dropdown">
        <uix-link
          @click=${() => this.setOpen(!this.open)}
          data-theme="uix-dropdown__button"
        >
          <uix-list align="center">
            ${this.icon ? html` <uix-icon name=${this.icon}></uix-icon> ` : ""}
            ${this.label}
            ${!this.icon ? html`<uix-icon name="chevron-down"></uix-icon>` : ""}
          </uix-list>
        </uix-link>
        <div ?hidden=${!this.open} data-theme="uix-dropdown__panel">
          ${this.items.map(
            (item) =>
              html`
                <uix-list align="center">
                  <uix-link
                    href=${item.href}
                    .onclick=${item.onclick}
                    data-theme="uix-dropdown__item"
                    >${item.label}
                  </uix-link>

                  ${item.icon
                    ? html` <uix-icon name=${item.icon}></uix-icon> `
                    : ""}
                </uix-list>
              `,
          )}
        </div>
      </div>
    `;
  },
};
