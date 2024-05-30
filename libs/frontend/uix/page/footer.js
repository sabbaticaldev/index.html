import { html, T } from "helpers";
const Footer = {
  tag: "uix-footer",
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
    "uix-footer__block":
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between",
    "uix-footer": "bg-gray-100 py-8",
    "uix-footer__links": "flex space-x-6",
  },
  render() {
    return html`
      <uix-container class=${this.theme("uix-footer")}></uix-container>
        <uix-block class=${this.theme("uix-footer__block")}>        
          <uix-text>${this.copyright}</uix-text>
          <uix-list class=${this.theme("uix-footer__links")}>
            ${this.links.map(
              (link) =>
                html`<uix-link href=${link.href}>${link.text}</uix-link>`,
  )}
          </uix-list>
        </uix-container>
      </uix-block>
    `;
  },
};
export default Footer;
