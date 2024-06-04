import { html, T } from "helpers";

const Tooltip = {
  tag: "uix-tooltip",
  props: {
    spacing: T.string({ defaultValue: "md" }),
  },
  theme: ({ cls, SpacingSizes, borderRadius, BaseVariants }) => ({
    "uix-tooltip": {
      _base: cls(["relative group relative m-12", borderRadius]),
      spacing: SpacingSizes,
    },
    "uix-tooltip__button": {
      _base: cls([
        "bg-gray-500 px-4 py-2 text-sm shadow-sm text-white",
        borderRadius,
      ]),
      variant: BaseVariants,
      spacing: SpacingSizes,
    },
    "uix-tooltip__content":
      "absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-white text-xs group-hover:scale-100 nowrap",
  }),
  render() {
    return html`
      <button data-theme="uix-tooltip__button">
        <slot name="button"></slot>
      </button>
      <span data-theme="uix-tooltip__content">
        <slot></slot>
      </span>
    `;
  },
};
export default Tooltip;
