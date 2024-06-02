import { html, T } from "helpers";

export default {
  tag: "uix-app-shell",
  props: { containerClass: T.string() },
  theme: {
    "uix-app-shell": "w-full h-full flex flex-col",
    "uix-app-shell__content": "flex h-full",
    "uix-app-shell__main": "relative content flex-grow overflow-y-auto",
  },
  render() {
    const { navbarItems, navbarPosition } = this;

    const navbarSlot =
      navbarPosition === "left" ? "left-navbar" : "right-navbar";
    return html`
      <uix-topbar>
        <uix-logo slot="logo"></uix-logo>
        <uix-navbar slot="navbar" .items=${navbarItems}></uix-navbar>
      </uix-topbar>
      <slot name="top-navbar"></slot>
      <div data-theme="uix-app-shell__content">
        <slot name="left-navbar"></slot>
        <main data-theme="uix-app-shell__main">
          <slot></slot>
        </main>
        <slot name="right-navbar"></slot>
      </div>
      <slot name="footer"></slot>
    `;
  },
};
