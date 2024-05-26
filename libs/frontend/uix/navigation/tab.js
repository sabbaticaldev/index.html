import { html, T } from "helpers";

const Tab = {
  props: {
    active: T.boolean(),
    parent: T.object(),
    onclick: T.function(),
    onclose: T.function(),
  },
  theme: ({ cls, baseTheme, BaseVariants, SpacingSizes }) => ({
    "uix-tab": {
      _base: cls([
        "relative group",
        baseTheme.flexCenter,
        "p-2 -mb-px sm:px-4 -px-1 w-full h-full whitespace-nowrap focus:outline-none",
        baseTheme.borderStyles,
        baseTheme.borderWidth,
      ]),
      active: {
        true: cls([baseTheme.activeTextColor, "border-blue-500"]),
        false: cls([baseTheme.defaultTextColor, baseTheme.hoverBorder]),
      },
      variant: BaseVariants,
      size: SpacingSizes,
    },
    "uix-tab__close-button":
      "absolute top-1 right-2 text-sm font-bold leading-none group-hover:inline hidden",
  }),
  selectTab(e) {
    this.parentElement.unselectTab();
    this.setActive(true);
    this.onclick?.(e);
  },
  firstUpdated() {
    if (this.onclose) {
      this.shadowRoot.addEventListener("auxclick", (event) => {
        event.stopPropagation();
        if (event.button === 1) this.onclose();
      });
    }
  },
  render() {
    return html`
      <button
        role="tab"
        ?active=${this.active}
        @click=${this.selectTab.bind(this)}
        class=${this.theme("uix-tab")}
      >
        <slot></slot>
        ${this.onclose &&
        html`
          <button
            @click=${(event) => {
              event.stopPropagation();
              this.onclose();
            }}
            class=${this.theme("uix-tab__close-button")}
          >
            &times;
          </button>
        `}
      </button>
    `;
  },
};

export default Tab;
