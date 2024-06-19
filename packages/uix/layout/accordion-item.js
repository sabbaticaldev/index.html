import "./container.js";
import "../content/text.js";
import "../content/icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "frontend";

class AccordionItem extends ReactiveView {
  static get properties() {
    return {
      label: T.string(),
      icon: T.string(),
      open: T.boolean(),
    };
  }

  static theme = {
    ".uix-accordion__summary": "list-none cursor-pointer block",
  };

  render() {
    return html`
      <details ?open=${this.open}>
        <summary class="uix-accordion__summary">
          <uix-container horizontal items="center" justify="between">
            <uix-text size="sm" icon=${this.icon}>${this.label}</uix-text>
            <uix-icon
              name=${this.open ? "chevron-up" : "chevron-down"}
            ></uix-icon>
          </uix-container>
        </summary>
        <uix-container>
          <slot></slot>
        </uix-container>
      </details>
    `;
  }
}

export default ReactiveView.define("uix-accordion-item", AccordionItem);
