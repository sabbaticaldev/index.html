import "../content/icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "frontend";
class Logo extends ReactiveView {
  static get properties() {
    return {
      icon: T.string(),
      name: T.string(),
      logo: T.string(),
      image: T.string(),
    };
  }
  static theme = {
    "": "cursor-default",
    ".uix-logo__asset": "w-8 h-8",
  };

  render() {
    const { icon, name, logo } = this;

    return html`
      <uix-container horizontal gap="sm" items="center">
        <uix-container class="uix-logo__asset">
          ${logo ? html`<img src=${logo} alt=${name} />` : ""}
          ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
        </uix-container>
        <slot name="image"> </slot>
        <slot></slot>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-logo", Logo);
