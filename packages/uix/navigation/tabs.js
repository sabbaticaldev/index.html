import "../layout/container.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, T } from "frontend";

const TabsVariants = {
  default: "border-gray-200 text-gray-500 hover:text-gray-700",
  primary: `border-${defaultTheme.colors.primary}-500 text-${defaultTheme.colors.primary} hover:text-${defaultTheme.colors.primary}-dark`,
  secondary: `border-${defaultTheme.colors.secondary}-500 text-${defaultTheme.colors.secondary} hover:text-${defaultTheme.colors.secondary}-dark`,
};

class Tabs extends ReactiveView {
  static get properties() {
    return {
      size: T.string({ defaultValue: "md" }),
      gap: T.string({ defaultValue: "" }),
      spacing: T.string(),
      padding: T.string(),
      vertical: T.boolean(),
      full: T.boolean({ defaultValue: true }),
      activeTab: T.string(),
    };
  }

  static theme = {
    "[&_[tab]:hover]": "text-gray-600 bg-blue-200",
    "[&_[active]]": "text-red-900 bg-blue",
    "[&_[tab]]": "leading-12 w-full text-center",
    ".uix-tabs__container": `divide-x border-b mb-2 ${genTheme(
      "variant",
      Object.keys(TabsVariants),
      (entry) => TabsVariants[entry],
      { string: true },
    )}
    `,
  };

  firstUpdated() {
    this.updateActiveTab(this.activeTab);
  }

  updateActiveTab(tabId) {
    const tabs = this.qaSlot();
    const contents = this.qaSlot({ slot: "content" });
    tabs.forEach((tab) => tab.removeAttribute("active"));
    contents.forEach((content) => (content.style.display = "none"));

    if (tabId) {
      const activeTab = tabs.find((tab) => tab.getAttribute("tab") === tabId);
      const activeContent = contents.find(
        (content) => content.getAttribute("id") === tabId,
      );

      if (activeTab) activeTab.setAttribute("active", true);
      if (activeContent) activeContent.style.display = "flex";
    } else {
      if (!tabId || !tabs.some((tab) => tab.getAttribute("id") === tabId)) {
        const firstTab = tabs[0];
        const firstContent = contents[0];

        if (firstTab) firstTab.setAttribute("active", true);
        if (firstContent) firstContent.style.display = "flex";
      }
    }
  }

  selectTab(e) {
    const tabId = e.target.getAttribute("tab");
    this.updateActiveTab(tabId);
  }

  render() {
    return html`
      <uix-container gap=${this.gap}>
        <uix-container
          tabs
          ?horizontal=${!this.vertical}
          spacing=${this.spacing}
          padding=${this.padding}
          items="center"
          justify="between"
          class="uix-tabs__container"
        >
          <slot @click=${this.selectTab}></slot>
        </uix-container>
        <slot name="content"></slot>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-tabs", Tabs);
