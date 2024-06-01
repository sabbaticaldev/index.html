import { html, T } from "helpers";
const Navbar = {
  tag: "uix-navbar",
  props: {
    variant: T.string({ defaultValue: "fixed" }),
    multiple: T.boolean(),
    open: T.boolean(),
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        href: T.string({ nullable: true }),
        active: T.boolean({ defaultValue: false }),
        links: T.array({
          defaultValue: [],
          type: {
            label: T.string(),
            href: T.string(),
            active: T.boolean({ defaultValue: false }),
          },
        }),
      },
    }),
  },
  theme: {
    "uix-navbar":
      "flex items-center justify-between px-4 py-3 bg-white shadow-md",
    "uix-navbar__list": "flex space-x-4",
    "uix-navbar__link": {
      _base: "text-gray-600 hover:text-gray-800",
      active: {
        true: "font-bold text-blue-600",
      },
    },
    "uix-navbar__section": "flex flex-col space-y-2",
    "uix-navbar__section-link": {
      _base: "text-gray-600 hover:text-gray-800",
      active: {
        true: "font-bold text-blue-600",
      },
    },
  },
  render() {
    return html`
      <nav data-theme="uix-navbar">
        ${this.variant === "accordion"
          ? html`
              <uix-accordion
                ?multiple=${this.multiple}
                .items=${this.items.map((item) => ({
                  label: item.label,
                  content: html`
                    ${item.links.map(
                      (link) => html`
                        <uix-link
                          href=${link.href}
                          data-theme="uix-navbar__section-link"
                          ?active=${link.active}
                        >
                          ${link.label}
                        </uix-link>
                      `,
                    )}
                  `,
                  open: this.open ? this.open : item.open,
                }))}
              ></uix-accordion>
            `
          : html`
              <uix-list data-theme="uix-navbar__list">
                ${this.items.map((item) =>
                  item.links.length
                    ? html`
                        <div data-theme="uix-navbar__section">
                          <span>${item.label}</span>
                          ${item.links.map(
                            (link) => html`
                              <uix-link
                                href=${link.href}
                                data-theme="uix-navbar__section-link"
                                ?active=${link.active}
                              >
                                ${link.label}
                              </uix-link>
                            `,
                          )}
                        </div>
                      `
                    : html`
                        <uix-link
                          href=${item.href}
                          data-theme="uix-navbar__link"
                          ?active=${item.active}
                        >
                          ${item.label}
                        </uix-link>
                      `,
                )}
              </uix-list>
            `}
      </nav>
    `;
  },
};

export default Navbar;
