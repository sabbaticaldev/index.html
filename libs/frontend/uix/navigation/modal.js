import { html, T } from "helpers";

const Modal = {
  props: {
    actions: T.function(),
    size: T.string({ defaultValue: "md" }),
    parent: T.object(),
    open: T.boolean(),
  },
  theme: {
    "uix-modal": (_, { cls, SpacingSizes, borderRadius }) => ({
      _base: cls([
        "rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]",
        borderRadius,
      ]),
      size: SpacingSizes,
    }),
    "uix-modal__box": "modal-box",
    "uix-modal__close-button": (_, { cls, borderRadius }) =>
      cls(["absolute right-1 top-0", borderRadius]),
  },
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
      <dialog id="modal" ?open=${this.open} class=${this.theme("uix-modal")}>
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
