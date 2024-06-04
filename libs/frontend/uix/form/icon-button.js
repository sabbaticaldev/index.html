import { html, T } from "helpers";
export default {
  tag: "uix-icon-button",
  props: {
    name: T.string(),
    variant: T.string(),
    size: T.string(),
    alt: T.string(),
  },
  theme: ({ cls, borderRadius, BaseVariants }) => ({
    "uix-icon-button": {
      _base: cls(["transition ease-in-out duration-200 mx-auto", borderRadius]),
      variant: BaseVariants,
    },
  }),
  render() {
    return html`
      <button alt=${this.alt} data-theme="uix-icon-button">
        <uix-icon name=${this.name}></uix-icon>
      </button>
    `;
  },
};
