import { html, T } from "helpers";

export default {
  tag: "uix-form-control",
  props: {
    label: T.string({ type: String, defaultValue: null }),
    labelAlt: T.array({ defaultValue: [] }),
  },
  render() {
    const { label, labelAlt } = this;
    return html`
      ${label
        ? html`
            <label data-theme="uix-form-control__label">
              <span data-theme="uix-form-control__label-text"> ${label} </span>
            </label>
          `
        : ""}
      <slot></slot>
      ${labelAlt?.length
        ? html`
            <label data-theme="uix-form-control__label">
              <span data-theme="uix-form-control__label-alt">
                ${labelAlt}
              </span>
            </label>
          `
        : ""}
    `;
  },
  theme: {
    "uix-form-control": "form-control w-full",
    "uix-form-control__label": "label",
    "uix-form-control__label-text": "label-text",
    "uix-form-control__label-alt": "label-text-alt",
  },
};
