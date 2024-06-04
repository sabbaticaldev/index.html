import { html, ifDefined, T } from "helpers";

const Modal = {
  tag: "uix-modal",
  props: {
    actions: T.function(),
    size: T.string({ defaultValue: "md" }),
    parent: T.object(),
    open: T.boolean(),
    label: T.string(),
    icon: T.string(),
    dropdown: T.array(),
    width: T.string(),
    height: T.string(),
  },
  theme: ({ cls, SpacingSizes, borderRadius }) => ({
    "uix-modal__box": {
      _base: cls([
        "rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]",
        borderRadius,
      ]),
      size: SpacingSizes,
    },
    "uix-modal__header": "flex justify-between mb-4",
    "uix-modal__title": "flex items-center",
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
        data-theme="uix-modal"
        style=${ifDefined(
          this.width && this.height
            ? `width: ${this.width}; height: ${this.height};`
            : undefined,
        )}
      >
        <div data-theme="uix-modal__box">
          <div data-theme="uix-modal__header">
            <div data-theme="uix-modal__title">
              ${this.icon ? html`<uix-icon name=${this.icon}></uix-icon>` : ""}
              ${this.label}
            </div>
            <div>
              ${this.dropdown?.length
                ? html`
                    <uix-button dropdown="open">
                      <uix-icon name="more-vertical"></uix-icon>
                      <ul slot="dropdown">
                        ${this.dropdown.map(
                          (item) => html`
                            <li>
                              <uix-button size="xs" @click=${item.click}
                                >${item.label}</uix-button
                              >
                            </li>
                          `,
                        )}
                      </ul>
                    </uix-button>
                  `
                : ""}
              <uix-button
                @click=${this.hide.bind(this)}
                size="sm"
                data-theme="uix-modal__close-button"
                >✕</uix-button
              >
            </div>
          </div>
          <uix-list vertical>
            <slot></slot>
            <uix-list data-theme="uix-modal__footer">
              ${this.actions?.({ host: this }) || ""}
            </uix-list>
          </uix-list>
        </div>
      </dialog>
    `;
  },
};

export default Modal;
