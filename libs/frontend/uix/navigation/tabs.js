import { html, T, genTheme, defaultTheme } from "helpers";

const TabsVariants = {
  default: "border-gray-200 text-gray-500 hover:text-gray-700",
  primary: `border-${defaultTheme.colors.primary}-500 text-${defaultTheme.colors.primary} hover:text-${defaultTheme.colors.primary}-dark`,
  secondary: `border-${defaultTheme.colors.secondary}-500 text-${defaultTheme.colors.secondary} hover:text-${defaultTheme.colors.secondary}-dark`,
};

export default {
  tag: "uix-tabs",
  props: {
    size: T.string({ defaultValue: "md" }),
    gap: T.string({ defaultValue: "" }),
    spacing: T.string({ defaultValue: "md" }),
    vertical: T.boolean(),
    full: T.boolean({ defaultValue: true }),
    activeTab: T.string(), 
  },
  _theme: {    
    "[&_:hover]": "text-blue-900",
    "[&_[active]]": "text-red-900 bg-blue",
    "[&_*]": "p-4",
    ".uix-tabs__container": `border-b ${genTheme('variant', Object.keys(TabsVariants), (entry) => TabsVariants[entry], { string: true })}`,
    ".uix-tab": `relative group p-2 -mb-px sm:px-4 w-full h-full whitespace-nowrap focus:outline-none ${defaultTheme.borderStyles} ${defaultTheme.borderWidth}`,
    "[&:not([active])]:uix-tab": `text-gray-500 hover:text-gray-700`,
    "[active].uix-tab": `text-blue-600 border-blue-500`,
  },
  connectedCallback() {
    super.connectedCallback();
  },
  selectTab(e) {
    this.qaSlot().map(e => e.removeAttribute("active"));
    e.target.setAttribute("active", true);
  },
  render() {
    return html`
        <uix-container
          ?horizontal=${!this.vertical}
          spacing=${this.spacing}
          items="center"
          justify="between"
          class="uix-tabs__container"
          gap=${this.gap}
        >
          <slot @click=${this.selectTab}></slot>
      </uix-container>      
    `;
  },
};
