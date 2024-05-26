import { html, T } from "helpers";

const Loading = {
  props: {
    isVisible: T.boolean(),
    message: T.string({ defaultValue: null }),
    size: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "primary" }),
  },
  render() {
    const { isVisible, message, type, size } = this;
    if (!isVisible) return html``;
    const Loading = {
      spinner: "loading loading-spinner",
      dots: "loading loading-dots",
      ring: "loading loading-ring",
      ball: "loading loading-ball",
      bars: "loading loading-bars",
      infinity: "loading loading-infinity",
    };
    const LoadingSize = {
      lg: "loading-lg",
      md: "loading-md",
      sm: "loading-sm",
      xs: "loading-xs",
    };

    const loadingClass = `${Loading[type]} ${LoadingSize[size]}`;

    return html`
      <span class="${loadingClass}">
        ${message ? html`<span>${message}</span>` : ""}
        ${message && type === "spinner"
          ? html`<uix-icon name="spinner"></uix-icon>`
          : ""}
      </span>
    `;
  },
};

export default Loading;
