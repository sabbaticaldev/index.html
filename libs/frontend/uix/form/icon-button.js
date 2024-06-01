import { html, T } from "helpers";
export default {
  tag: "uix-icon-button",
  props: {
    icon: T.string(),
    variant: T.string(),
    size: T.string(),
    alt: T.string(),
  },
  theme: ({ cls, borderRadius, BaseVariants, TextSizes }) => ({
    "uix-icon-button": {
      _base: cls(["transition ease-in-out duration-200 mx-auto", borderRadius]),
      variant: BaseVariants,
    },
    "uix-icon-button__icon": {
      _base: "mx-auto",
      size: TextSizes,
    },
  }),
  render() {
    return html`
      <button alt=${this.alt} data-theme="uix-icon-button">
        <uix-icon
          data-theme="uix-icon-button__icon"
          name=${this.icon}
        ></uix-icon>
      </button>
    `;
  },
};
