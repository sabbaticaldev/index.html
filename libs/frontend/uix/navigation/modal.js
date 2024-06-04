import { css, html, ifDefined, T } from "helpers";
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
  theme: ({ cls, SpacingSizes, borderRadius, WidthSizes }) => ({
    "uix-modal__box": {
      _base: cls([
        "rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]",
        borderRadius,
      ]),
      size: SpacingSizes,
      width: WidthSizes,
    },
    "uix-modal__header": "flex justify-between mb-4",
    "uix-modal__title": "flex items-center grow",
    "uix-modal__close-button": cls(["absolute right-1 top-0", borderRadius]),
  }),
  style: css`
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
  `,
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
          <uix-list vertical justify="between" full>
            <uix-list justify="between" align="center" full>
              <div data-theme="uix-modal__title">
                ${this.icon
                  ? html`<uix-icon name=${this.icon}></uix-icon>`
                  : ""}
                ${this.label}
              </div>
              ${this.dropdown?.length
                ? html`
                    <uix-dropdown
                      label="Dropdown"
                      .items=${this.dropdown}
                    ></uix-dropdown>
                  `
                : html`<uix-icon-button
                    @click=${this.hide.bind(this)}
                    size="sm"
                    name="x"
                  ></uix-icon-button>`}
            </uix-list>
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
