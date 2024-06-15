import { css, html, T, genTheme, defaultTheme } from "helpers";

const ModalVariants = {
  default: "bg-white",
  primary: `bg-${defaultTheme.colors.primary}-100`,
  secondary: `bg-${defaultTheme.colors.secondary}-100`,
};

export default {
  tag: "uix-modal",
  props: {
    size: T.string({ defaultValue: "md" }),
    open: T.boolean({ defaultValue: false }),
    variant: T.string({ defaultValue: "default" }),
  },

  style: css`
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
  `,
  firstUpdated() {
    this.$modal = this.shadowRoot.querySelector("#modal");
    if (this.parent) this.parent.hide = this.hide.bind(this);
  },
  _theme: {
    ".uix-modal__dialog": `rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]`,
    ".uix-modal__container": `relative rounded-lg p-6 shadow-lg 
    ${genTheme('variant', Object.keys(ModalVariants), (entry) => ModalVariants[entry], { string: true })}`,
    "[&:not([size])]": "max-w-lg",
    ...genTheme('size', ["sm", "md", "lg", "xl"], (entry) => `max-w-${entry}`),
  },
  toggle() {
    this.open ? this.$modal.close() : this.$modal.showModal();
    this.open = !this.open;
  },
  render() {
    return html`
      <slot name="cta" class="uix-modal__dialog" @click=${this.toggle.bind(this)}></slot>
      <dialog
        id="modal"
        ?open=${this.open}
      >
        <uix-container class="uix-modal__container" ?open=${this.open} @click=${(e) => e.stopPropagation()}>
          <slot name="header"></slot>
          <slot name="body"></slot>
          <slot name="footer"></slot>
        </uix-container>
        </dialog>
      
    `;
  },
};
