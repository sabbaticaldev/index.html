import { html, T } from "helpers";

const ContextMenu = {
  props: { open: T.boolean(), contextmenu: T.function() },
  theme: {
    "uix-context-menu":
      "z-10 absolute top-6 left-10 bg-white border border-gray-300 shadow-lg",
  },
  closeContextMenuHandler() {
    this.setOpen(false);
  },
  documentClickHandler(event) {
    if (!this.contains(event.target) && this !== event.target) {
      this.setOpen(false);
    }
  },
  escapeKeyHandler(event) {
    if (event.key === "Escape") {
      this.setOpen(false);
    }
  },
  connectedCallback() {
    document.addEventListener(
      "close-context-menu",
      this.closeContextMenuHandler.bind(this),
    );
    document.addEventListener("click", this.documentClickHandler.bind(this));
    document.addEventListener("keydown", this.escapeKeyHandler.bind(this));
  },
  disconnectedCallback() {
    document.removeEventListener(
      "close-context-menu",
      this.closeContextMenuHandler,
    );
    document.removeEventListener("click", this.documentClickHandler);
    document.removeEventListener("keydown", this.escapeKeyHandler);
  },
  render() {
    return html`
      <div class=${this.theme("uix-context-menu")} ?hidden=${!this.open}>
        <slot name="menu"></slot>
      </div>
      <slot
        @contextmenu=${(e) => {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("close-context-menu"));
          setTimeout(() => {
            this.setOpen(true);
          }, 0);
        }}
      ></slot>
    `;
  },
};

export default ContextMenu;
