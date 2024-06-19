import "../layout/container.js";
import "./icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "frontend";

import uixText from "./text.js";

const defaultOnClick = (e) => {
  const link = e.currentTarget;

  if (link.tagName === "A" && link.origin === window.location.origin) {
    e.preventDefault();
    history.pushState(null, "", link.href);
    window.dispatchEvent(new Event("popstate"));
  }
};

class Link extends ReactiveView {
  static get properties() {
    return {
      ...uixText.properties,
      href: T.string(),
      onclick: T.function(),
      icon: T.string(),
    };
  }
  static theme = {
    ".uix-link__element": "w-full",
  };

  render() {
    const iconAndLabel = this.icon
      ? html`<uix-container horizontal items="center" gap="sm"
          ><uix-icon name=${this.icon}></uix-icon><slot></slot
        ></uix-container>`
      : html`<slot></slot>`;
    return this.href
      ? html`<a
          class="uix-link__element"
          href=${this.href}
          @click=${this.onclick || defaultOnClick}
        >
          ${iconAndLabel}
        </a>`
      : html`<button class="uix-link__element" @click=${this.onclick}>
          ${iconAndLabel}
        </button>`;
  }
}

export default ReactiveView.define("uix-link", Link);
