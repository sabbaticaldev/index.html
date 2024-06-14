import { html, T } from "helpers";

export default {
  tag: "uix-accordion-item",
  props: {
    label: T.string(),
    icon: T.string(),
    open: T.boolean({ defaultValue: false }),
  },
  _theme: {
    ".uix-accordion__summary": " list-none cursor-pointer block"
  },
  render() {
    return html`
      <details ?open=${this.open}>
        <summary class="uix-accordion__summary">
          <uix-container horizontal items="center" justify="between">
            <uix-text size="sm" icon=${this.icon}>
                ${this.label}
            </uix-text>
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
};
