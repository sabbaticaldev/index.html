import "../layout/container.js";
import "./icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";

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

  render() {
    return this.href
      ? html`<a href=${this.href} @click=${this.onclick || defaultOnClick}>
          ${this.icon
            ? html`<uix-container horizontal gap="sm" items="center"
                ><uix-icon name=${this.icon}></uix-icon><slot></slot
              ></uix-container>`
            : html`<slot></slot>`}
        </a>`
      : html`<button @click=${this.onclick}>
          ${this.icon
            ? html`<uix-container horizontal items="center" gap="sm"
                ><uix-icon name=${this.icon}></uix-icon><slot></slot
              ></uix-container>`
            : html`<slot></slot>`}
        </button>`;
  }
}

export default ReactiveView.define("uix-link", Link);
