import { html, T } from "helpers";

const Drawer = {
  tag: "uix-drawer",
  props: {
    open: T.boolean({ defaultValue: false }),
    position: T.string({ defaultValue: "left" }),
  },
  theme: {
    "uix-drawer": ({ position }) => ({
      _base:
        "fixed top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-50",
      open: {
        true: "translate-x-0",
        false: position === "left" ? "-translate-x-full" : "translate-x-full",
      },
    }),
    "uix-drawer__overlay": "fixed inset-0 bg-black bg-opacity-50 z-40",
  },
  render() {
    return html`
      <div
        class=${this.theme("uix-drawer", {
          open: this.open,
          position: this.position,
        })}
      >
        <slot></slot>
      </div>
      ${this.open
        ? html`<div
            class=${this.theme("uix-drawer__overlay")}
            @click=${() => this.setOpen(false)}
          ></div>`
        : ""}
    `;
  },
};

export default Drawer;
