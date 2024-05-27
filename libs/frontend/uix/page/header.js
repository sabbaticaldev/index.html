import { html, T } from "helpers";
const Header = {
  props: {
    logo: T.string(),
    navItems: T.array({
      defaultValue: [],
      type: {
        text: T.string(),
        href: T.string(),
      },
    }),
  },
  theme: {
    "uix-header__block": "bg-white shadow-sm",
    "uix-header":
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4",
    "uix-header__logo": "text-xl font-semibold",
    "uix-header__nav": "flex space-x-4",
  },
  render() {
    return html`
      <uix-container class=${this.theme("uix-header")}>
        <uix-block class=${this.theme("uix-header__block")}>
          <uix-logo class=${this.theme("uix-header__logo")}
            >${this.logo}</uix-logo
          >
          <uix-list class=${this.theme("uix-header__nav")}>
            ${this.navItems.map(
              (item) =>
                html`<uix-nav-item href=${item.href}
                  >${item.text}</uix-nav-item
                >`,
  )}
          </uix-list>
        </uix-block>
      </uix-container>
    `;
  },
};
export default Header;
