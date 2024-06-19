import { html, T } from "frontend";

const ContextMenu = {
  tag: "uix-context-menu",
  props: { open: T.boolean(), contextmenu: T.function() },
  theme: {
    "uix-context-menu": "relative",
    "uix-context-menu__menu":
      "z-10 absolute top-12 left-10 bg-white border border-gray-300 shadow-lg",
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
      <slot
        @contextmenu=${(e) => {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("close-context-menu"));
          setTimeout(() => {
            this.setOpen(true);
          }, 0);
        }}
      ></slot>
      <div class="uix-context-menu__menu" ?hidden=${!this.open}>
        <uix-container><slot name="menu"></slot><uix-container>
      </div>
    `;
  },
};

export default ContextMenu;
