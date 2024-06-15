import { html, T, genTheme } from "helpers";

const DropdownVariants = {
  default: "bg-white text-gray-700",
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-500 text-white",
};

export default {
  tag: "uix-dropdown",
  props: {
    open: T.boolean({ defaultValue: false }),
    variant: T.string({ defaultValue: "default" }),
  },
  _theme: {
    "": "relative inline-block",
    "[&:not([variant])]": DropdownVariants.default,
    ...genTheme('variant', Object.keys(DropdownVariants), (entry) => DropdownVariants[entry]),
    ".uix-dropdown__button": "inline-flex items-center cursor-pointer",
    ".uix-dropdown__panel": "absolute right-0 mt-2 w-56 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10",
  },
  toggle() {
    this.open = !this.open;
  },
  render() {
    return html`
      <div class="uix-dropdown">
        <slot name="link" @click=${this.toggle} class="uix-dropdown__button"></slot>
        ${this.open ? html`<div class="uix-dropdown__panel"><slot></slot></div>` : ""}
      </div>
    `;
  },
};

