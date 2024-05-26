import { html, T } from "helpers";

const FormControl = {
  props: {
    label: T.string({ type: String, defaultValue: null }),
    labelAlt: T.array({ defaultValue: [] }),
  },
  render() {
    const { label, labelAlt } = this;
    return html`
      <div class=${this.theme("uix-form-control")}>
        ${label
          ? html`
              <label class=${this.theme("uix-form-control__label")}>
                <span class=${this.theme("uix-form-control__label-text")}>
                  ${label}
                </span>
              </label>
            `
          : ""}
        <slot></slot>
        ${labelAlt?.length
          ? html`
              <label class=${this.theme("uix-form-control__label")}>
                <span class=${this.theme("uix-form-control__label-alt")}>
                  ${labelAlt}
                </span>
              </label>
            `
          : ""}
      </div>
    `;
  },
  theme: () => ({
    "uix-form-control": "form-control w-full",
    "uix-form-control__label": "label",
    "uix-form-control__label-text": "label-text",
    "uix-form-control__label-alt": "label-text-alt",
  }),
};

export default FormControl;
