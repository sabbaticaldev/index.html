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
    "uix-header": "bg-white shadow-sm",
    "uix-header__container":
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4",
    "uix-header__logo": "text-xl font-semibold",
    "uix-header__nav": "flex space-x-4",
  },
  render() {
    return html`
      <header class=${this.theme("uix-header")}>
        <div class=${this.theme("uix-header__container")}>
          <uix-logo class=${this.theme("uix-header__logo")}
            >${this.logo}</uix-logo
          >
          <nav class=${this.theme("uix-header__nav")}>
            ${this.navItems.map(
              (item) =>
      html`<uix-nav-item href=${item.href}
                  >${item.text}</uix-nav-item
                >`,
            )}
          </nav>
        </div>
      </header>
    `;
  },
};

export default Header;
