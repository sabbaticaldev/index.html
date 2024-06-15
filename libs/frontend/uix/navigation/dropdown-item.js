import { html, T, genTheme } from "helpers";

const DropdownItemVariants = {
  default: "hover:bg-gray-100",
  primary: "hover:bg-blue-600",
  secondary: "hover:bg-gray-600",
};


export default {
  tag: "uix-dropdown-item",
  props: {
    label: T.string(),
    icon: T.string(),
    href: T.string(),
    variant: T.string({ defaultValue: "default" }),
    submenu: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        icon: T.string(),
        href: T.string(),
      },
    }),
  },
  _theme: {
    "": "block px-4 py-2 text-sm",
    "[&:not([variant])]": DropdownItemVariants.default,
    ...genTheme('variant', Object.keys(DropdownItemVariants), (entry) => DropdownItemVariants[entry]),
    ".uix-dropdown-item__submenu": "ml-4 mt-2",
  },
  render() {
    return html`
      <uix-link href=${this.href} class="uix-dropdown-item">
        ${this.icon ? html`<uix-icon name=${this.icon}></uix-icon>` : ""}
        ${this.label}
      </uix-link>
      ${this.submenu.length > 0
        ? html`
            <uix-container class="uix-dropdown-item__submenu">
              ${this.submenu.map(
                (item) =>
                  html`
                    <uix-dropdown-item
                      label=${item.label}
                      icon=${item.icon}
                      href=${item.href}
                    ></uix-dropdown-item>
                  `
              )}
            </uix-container>
          `
        : ""}
    `;
  },
};
