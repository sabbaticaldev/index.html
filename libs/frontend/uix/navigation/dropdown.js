import { defaultTheme, genTheme, html, T } from "helpers";

const DropdownVariants = {
  default: "bg-white text-gray-700",
  primary: `bg-${defaultTheme.colors.primary}-500 text-white`,
  secondary: `bg-${defaultTheme.colors.secondary}-500 text-white`,
};

export default {
  tag: "uix-dropdown",
  props: {
    open: T.boolean({ defaultValue: false }),
    variant: T.string({ defaultValue: "default" }),
  },
  _theme: {
    "": "relative inline-block",
    "[&_uix-link]": "py-2 px-4",
    "[&:not([variant])]": DropdownVariants.default,
    ...genTheme(
      "variant",
      Object.keys(DropdownVariants),
      (entry) => DropdownVariants[entry],
    ),
    ".uix-dropdown__button": "inline-flex items-center cursor-pointer",
    ".uix-dropdown__panel":
      "absolute right-0 mt-2 w-56 bg-white border scale-90 border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-10",
  },
  firstUpdated() {
    this.toggle = this.toggle.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  },
  toggle() {
    this.open = !this.open;
    if (this.open) {
      document.addEventListener("click", this.handleOutsideClick);
    } else {
      document.removeEventListener("click", this.handleOutsideClick);
    }
  },
  handleOutsideClick(event) {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.open = false;
      this.requestUpdate();
      document.removeEventListener("click", this.handleOutsideClick);
    }
  },
  render() {
    return html`
      <slot
        name="cta"
        @click=${this.toggle}
        class="uix-dropdown__button"
      ></slot>
      ${this.open
        ? html`<uix-container class="uix-dropdown__panel"
            ><slot></slot
          ></uix-container>`
        : ""}
    `;
  },
};
