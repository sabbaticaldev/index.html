import { html, T } from "helpers";

export default {
  tag: "uix-tabs",
  props: {
    size: T.string({ defaultValue: "md" }),
    gap: T.string({ defaultValue: "" }),
    spacing: T.string({ defaultValue: "md" }),
    vertical: T.boolean(),
    full: T.boolean({ defaultValue: true }),
    activeTab: T.string(),
    items: T.array({
      type: {
        label: T.string(),
        content: T.string(),
      },
    }),
  },
  theme: ({ baseTheme, SpacingSizes, BaseVariants, cls }) => ({
    "uix-tabs": {
      _base: "flex border-b border-gray-200",
      variant: baseTheme.BaseVariants,
      spacing: SpacingSizes,
      full: { true: "w-full h-full" },
    },
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
  }),
  render() {
    return html`
      <uix-list ?vertical=${!this.vertical}>
        <uix-list
          ?vertical=${this.vertical}
          spacing=${this.spacing}
          ?full=${this.full}
          data-theme="uix-tabs"
          gap=${this.gap}
        >
          ${this.items.map(
            (tab) => html`
              <button
                role="tab"
                ?active=${tab.active}
                @click=${() => this.setActiveTab(tab.label)}
                data-theme="uix-tab"
              >
                ${tab.label}
              </button>
            `,
          )}
        </uix-list>
        ${this.items.map((tab) =>
          tab.label === this.activeTab ? html` <div>${tab.content}</div> ` : "",
        )}
      </uix-list>
    `;
  },
};
