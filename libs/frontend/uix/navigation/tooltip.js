import { genTheme, html, T } from "helpers";

const TooltipVariants = {
  default: "bg-gray-800 text-white",
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-500 text-white",
  success: "bg-green-500 text-white",
  danger: "bg-red-500 text-white",
};

const Tooltip = {
  tag: "uix-tooltip",
  props: {
    spacing: T.string({ defaultValue: "md" }),
    variant: T.string({ defaultValue: "default" }),
    position: T.string({ defaultValue: "top" }),
  },
  _theme: {
    ".uix-tooltip__container":
      "relative inline-block [&_[content]]:hover:block",
    ".uix-tooltip__content": `absolute transform -translate-x-1/2 mt-2 transition-all duration-200 rounded p-2 text-xs  hidden
    ${TooltipVariants.default}
    ${genTheme(
      "variant",
      Object.keys(TooltipVariants),
      (entry) => TooltipVariants[entry],
      { string: true },
    )}`,
    "[&:not([position=top])]": "top-full left-1/2",
    "[&[position=top]]": "bottom-full left-1/2",
    "[&[position=right]]": "left-full top-1/2 transform -translate-y-1/2 mt-0",
    "[&[position=bottom]]": "top-full left-1/2 transform -translate-x-1/2 mt-2",
    "[&[position=left]]": "right-full top-1/2 transform -translate-y-1/2 mt-0",
  },
  render() {
    return html`
      <div
        class="uix-tooltip__container"
        variant=${this.variant}
        position=${this.position}
      >
        <slot name="cta"></slot>
        <span content class="uix-tooltip__content">
          <slot></slot>
        </span>
      </div>
    `;
  },
};

export default Tooltip;
