import { html, T } from "helpers";

export default {
  tag: "uix-modal-header",
  props: {
    label: T.string(),
    icon: T.string(),
  },
  _theme: {
    "": "flex justify-between items-center mb-4",
    ".uix-modal__title": "flex items-center text-lg font-semibold",
  },
  render() {
    return html`
      <div class="uix-modal-header">
        <div class="uix-modal__title">
          ${this.icon ? html`<uix-icon name=${this.icon}></uix-icon>` : ""}
          ${this.label}
        </div>
        <uix-icon-button @click=${() => this.dispatchEvent(new CustomEvent('close-modal'))} name="x"></uix-icon-button>
      </div>
    `;
  },
};
