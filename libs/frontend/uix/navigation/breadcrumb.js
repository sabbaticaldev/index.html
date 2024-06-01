import { html, T } from "helpers";

const Breadcrumb = {
  tag: "uix-breadcrumb",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        href: T.string(),
      },
    }),
  },
  theme: {
    "uix-breadcrumb__element": "flex items-center space-x-2",
    "uix-breadcrumb__item": "text-gray-500 hover:text-gray-700",
    "uix-breadcrumb__separator": "text-gray-400",
  },
  render() {
    return html`
      <nav
        class=${this.theme("uix-breadcrumb__element")}
        aria-label="Breadcrumb"
      >
        ${this.items.map(
          (item, index) => html`
            <a href=${item.href} class=${this.theme("uix-breadcrumb__item")}
              >${item.label}</a
            >
            ${index < this.items.length - 1
              ? html`<span class=${this.theme("uix-breadcrumb__separator")}
                  >/</span
                >`
              : ""}
          `,
        )}
      </nav>
    `;
  },
};

export default Breadcrumb;
