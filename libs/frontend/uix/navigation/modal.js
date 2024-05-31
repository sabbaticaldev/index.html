import { html, T } from "helpers";

const Modal = {
  tag: "uix-modal",
  props: {
    actions: T.function(),
    size: T.string({ defaultValue: "md" }),
    parent: T.object(),
    open: T.boolean(),
  },
  theme: ({ cls, SpacingSizes, borderRadius }) => ({
    "uix-modal__element": {
      _base: cls([
        "rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]",
        borderRadius,
      ]),
      size: SpacingSizes,
    },
    "uix-modal__box": "modal-box",
    "uix-modal__close-button": cls(["absolute right-1 top-0", borderRadius]),
  }),
  firstUpdated() {
    this.$modal = this.shadowRoot.querySelector("#modal");
    if (this.parent) this.parent.hide = this.hide.bind(this);
  },
  hide(msg = "") {
    this.$modal.close(msg);
  },
  show() {
    this.$modal.showModal();
  },
  render() {
    return html`
      <slot name="button" @click=${this.show.bind(this)}></slot>
      <dialog
        id="modal"
        ?open=${this.open}
        class=${this.theme("uix-modal__element")}
      >
        <div class=${this.theme("uix-modal__box")}>
          <uix-button
            @click=${this.hide.bind(this)}
            variant=""
            shape="circle"
            size="sm"
            class=${this.theme("uix-modal__close-button")}
            >✕</uix-button
          >
          <uix-list vertical>
            <slot></slot>
            <uix-list>
              <slot name="footer"></slot>
              ${this.actions?.({ host: this }) || ""}
            </uix-list>
          </uix-list>
        </div>
      </dialog>
    `;
  },
};

export default Modal;
