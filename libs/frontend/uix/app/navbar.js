import { html, T } from "helpers";
const Navbar = {
  tag: "uix-navbar",
  props: {
    variant: T.string({ defaultValue: "fixed" }),
    multiple: T.boolean(),
    onclick: T.function(),
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
    "uix-navbar__link": {
      _base: "text-gray-600 hover:text-gray-800",
      active: {
        true: "font-bold text-blue-600",
      },
    },
    "uix-navbar__section": "border-b",
    "uix-navbar__section-link": {
      _base: "text-gray-900 hover:text-gray-500 hover:font-bold",
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
                border
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
                          .onclick=${link.onclick}
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
              <uix-list vertical spacing="" gap="">
                ${this.items.map((item) =>
                  item.links.length
                    ? html`
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
