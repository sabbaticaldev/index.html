import { css, html, T, genTheme, sizeMap, defaultTheme } from "helpers";

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
    label: T.string(),
    icon: T.string(),
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
    ".uix-modal__dialog": `${defaultTheme.borderRadius} p-4 shadow-2xl [&:not([size])]:w-full [&:not([size])]:h-screen
    ${genTheme('size', ["sm", "md", "lg", "xl"], (entry) => `w-${sizeMap[entry]*2} min-h-${sizeMap[entry]} overflow-y-auto`, { string: true })} 
    ${genTheme('variant', Object.keys(ModalVariants), (entry) => ModalVariants[entry], { string: true })}`,     
  },
  toggle() {
    this.open ? this.$modal.close() : this.$modal.showModal();
    this.open = !this.open;
  },
  render() {
    return html`
      <slot name="cta" @click=${this.toggle.bind(this)}></slot>
      <dialog
        id="modal"
        class="uix-modal__dialog"
        ?open=${this.open}
        variant=${this.variant}
        size=${this.size}
      >
        <uix-container ?open=${this.open} @click=${(e) => e.stopPropagation()}>          
          <uix-container horizontal items="center" justify="between">
            <uix-text size="lg" weight="semibold" icon=${this.icon}>
              ${this.label}
              </uix-text>
            <uix-link .onclick=${this.toggle.bind(this)} icon="x"></uix-link>
          </uix-container>
          <slot></slot>
        </uix-container>
        </dialog>
      
    `;
  },
};