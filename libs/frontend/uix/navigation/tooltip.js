import { html, T } from "helpers";

const Tooltip = {
  tag: "uix-tooltip",
  props: {
    spacing: T.string({ defaultValue: "md" }),
  },
  theme: {
    "uix-tooltip": "group relative inline-block",
    "uix-tooltip__content":
      "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 scale-0 transition-all duration-200 rounded bg-gray-800 p-2 text-white text-xs group-hover:scale-100",
  },
  render() {
    return html`
      <div data-theme="uix-tooltip" class="">
        <slot name="button"></slot>
        <span
          data-theme="uix-tooltip__content"
          class="hidden group-hover:block"
        >
          <slot></slot>
        </span>
      </div>
    `;
  },
};

export default Tooltip;
