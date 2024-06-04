import { html, T } from "helpers";

const Breadcrumb = {
  tag: "uix-breadcrumb",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        icon: T.string(),
        active: T.boolean(),
        href: T.string(),
      },
    }),
  },
  theme: {
    "uix-breadcrumb": "flex items-center text-sm",
    "uix-breadcrumb__item": "text-gray-500 hover:text-gray-700 px-2 first:pl-0",
    "uix-breadcrumb__separator": "text-gray-400 last:hidden",
    "uix-breadcrumb__item--active": "text-blue-600 font-bold",
    "uix-breadcrumb__icon": "mr-1",
  },
  render() {
    return html`
      <nav data-theme="uix-breadcrumb" aria-label="Breadcrumb">
        ${this.items.map(
          (item, index) => html`
            ${item.active
              ? renderItem(item)
              : html`<uix-link href=${
                  item.href
                } data-theme="uix-breadcrumb__item">
              <uix-list align="center">
                ${renderItem(item)}
            </uix-link>`}
            ${index < this.items.length - 1
              ? html`<span data-theme="uix-breadcrumb__separator">›</span>`
              : ""}
          `,
        )}
      </nav>
    `;
  },
};
const renderItem = (item) => html`<uix-list align="center">
  ${item.icon
    ? html`
        <uix-icon
          name=${item.icon}
          data-theme="uix-breadcrumb__icon"
        ></uix-icon>
      `
    : ""}
  ${item.label}
</uix-list>`;

export default Breadcrumb;
