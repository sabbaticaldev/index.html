import "./logo.js";

import { ReactiveView } from "frontend";
import { html } from "helpers";
class AppShell extends ReactiveView {
  static theme = {
    "": "w-full h-full flex flex-col",
    ".uix-app-shell__content": "flex h-full",
    ".uix-app-shell__main": "relative content flex-grow overflow-y-auto",
  };

  render() {
    const { navbarItems } = this;
    return html`
      <uix-topbar>
        <uix-logo slot="logo"></uix-logo>
        <uix-navbar slot="navbar" .items=${navbarItems}></uix-navbar>
      </uix-topbar>
      <slot name="top-navbar"></slot>
      <div class="uix-app-shell__content">
        <slot name="left-navbar"></slot>
        <main class="uix-app-shell__main">
          <slot></slot>
        </main>
        <slot name="right-navbar"></slot>
      </div>
      <slot name="footer"></slot>
    `;
  }
}

export default ReactiveView.define("uix-app-shell", AppShell);
