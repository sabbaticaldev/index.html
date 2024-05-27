import { html, T } from "helpers";

const Footer = {
  props: {
    copyright: T.string(),
    links: T.array({
      defaultValue: [],
      type: {
        text: T.string(),
        href: T.string(),
      },
    }),
  },
  theme: {
    "uix-footer": "bg-gray-100 py-8",
    "uix-footer__container":
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between",
    "uix-footer__links": "flex space-x-6",
  },
  render() {
    return html`
      <footer class=${this.theme("uix-footer")}>
        <div class=${this.theme("uix-footer__container")}>
          <p>${this.copyright}</p>
          <div class=${this.theme("uix-footer__links")}>
            ${this.links.map(
              (link) =>
      html`<uix-link href=${link.href}>${link.text}</uix-link>`,
            )}
          </div>
        </div>
      </footer>
    `;
  },
};

export default Footer;
