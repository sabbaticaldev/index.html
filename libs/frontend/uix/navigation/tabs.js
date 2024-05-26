import { html, T } from "helpers";

export default {
  props: {
    size: T.string({ defaultValue: "md" }),
    gap: T.string({ defaultValue: "" }),
    spacing: T.string({ defaultValue: "md" }),
    vertical: T.boolean(),
    full: T.boolean(),
    tabs: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        content: T.string(),
        active: T.boolean(),
      },
    }),
  },
  theme: {
    "uix-tabs": (_, { cls, baseTheme, SpacingSizes }) => ({
      _base: cls([
        "flex w-full overflow-x-auto overflow-y-hidden border-gray-200",
      ]),
      variant: baseTheme.BaseVariants,
      spacing: SpacingSizes,
      full: { true: "w-full h-full" },
    }),
    "uix-tab": (_, { cls, baseTheme, BaseVariants, SpacingSizes }) => ({
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
    }),
  },
  unselectTab() {
    this.tabs = this.tabs.map((tab) => ({ ...tab, active: false }));
  },
  selectTab(tab) {
    this.unselectTab();
    tab.active = true;
    this.requestUpdate();
  },
  render() {
    return html`
      <uix-list
        ?vertical=${this.vertical}
        spacing=${this.spacing}
        ?full=${this.full}
        gap=${this.gap}
      >
        ${this.tabs.map(
    (tab) => html`
            <button
              role="tab"
              ?active=${tab.active}
              @click=${() => this.selectTab(tab)}
              class=${this.theme("uix-tab")}
            >
              ${tab.label}
            </button>
          `,
  )}
      </uix-list>
      ${this.tabs.map((tab) => tab.active && html` <div>${tab.content}</div> `)}
    `;
  },
};
