import { html, T } from "helpers";

export default {
  tag: "uix-navbar",
  props: {
    items: T.array(),
  },
  render() {
    return html`
      <uix-list>
        ${this.items.map(item => html`
          <uix-link href=${item.href}>${item.label}</uix-link>  
        `)}
      </uix-list>
    `;
  }
}
