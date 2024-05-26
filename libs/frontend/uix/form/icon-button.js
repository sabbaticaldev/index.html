import { html, T } from "helpers";

/**
 * Icon Button component
 *
 * The Icon Button component is a button that displays an icon.
 *
 * ## Usage
 *
 * ```html
 * <uix-icon-button icon="home" variant="primary"></uix-icon-button>
 * ```
 *
 * ## Props
 *
 * - `icon`: The name of the icon to display.
 * - `variant`: The variant of the button. Possible values are "default", "primary", "secondary", etc.
 * - `size`: The size of the button. Possible values are "sm", "md", "lg".
 * - `alt`: The alternative text for the icon.
 *
 */
const IconButton = {
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
      _base: cls(["mx-auto"]),
      size: TextSizes,
    },
  }),
  render() {
    return html`
      <button alt=${this.alt} class=${this.theme("uix-icon-button")}>
        <uix-icon
          class=${this.theme("uix-icon-button__icon")}
          name=${this.icon}
        ></uix-icon>
      </button>
    `;
  },
};

export default IconButton;
