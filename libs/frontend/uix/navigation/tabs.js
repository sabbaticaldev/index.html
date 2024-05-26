import { html, T } from "helpers";

const Tabs = {
  props: {
    size: T.string({ defaultValue: "md" }),
    gap: T.string({ defaultValue: "" }),
    spacing: T.string({ defaultValue: "md" }),
    vertical: T.boolean(),
    full: T.boolean(),
    selectTab: T.string(),
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
  },
  unselectTab() {
    const slot = this.shadowRoot.querySelector("slot");
    const tabs = slot
      .assignedNodes()
      .filter(
        (node) => node.tagName && node.tagName.toLowerCase() === "uix-tab",
      );
    tabs.forEach((tab) => tab.setActive(false));
  },
  render() {
    return html`
      <uix-list
        ?vertical=${this.vertical}
        spacing=${this.spacing}
        ?full=${this.full}
        gap=${this.gap}
      >
        <slot></slot>
      </uix-list>
    `;
  },
};

export default Tabs;
