import { html, T } from "helpers";

const Loading = {
  tag: "uix-loading",
  props: {
    isVisible: T.boolean(),
    type: T.string({ defaultValue: "spinner" }),
    message: T.string({ defaultValue: null }),
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "primary" }),
  },

  theme: ({ LoadingTypes, LoadingSize, BaseVariants }) => ({
    "uix-link": {
      _base: "",
      variant: BaseVariants,
      type: LoadingTypes,
      size: LoadingSize,
    },
  }),
  render() {
    const { isVisible, message, type } = this;
    if (!isVisible) return html``;

    return html`
      ${message ? html`<span>${message}</span>` : ""}
      ${message && type === "spinner"
        ? html`<uix-icon name="spinner"></uix-icon>`
    : ""}
    `;
  },
};

export default Loading;
