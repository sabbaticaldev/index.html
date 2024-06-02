import { html, T } from "helpers";

export default {
  tag: "uix-topbar",
  props: {
    linkNavbar: T.array(),
    appNavbar: T.array(),
  },
  render() {
    return html`
      <uix-block>
        <slot name="logo"></slot>
        ${this.linkNavbar ? html`<uix-navbar slot="navbar" .items=${this.linkNavbar}></uix-navbar>` : ''}
        ${this.appNavbar ? html`<uix-navbar slot="navbar" .items=${this.appNavbar}></uix-navbar>` : ''}
        <slot name="search"></slot>
      </uix-block>
    `;
  }
}
