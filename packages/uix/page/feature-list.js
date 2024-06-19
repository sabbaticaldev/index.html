import { html, T } from "frontend";
const FeatureList = {
  tag: "uix-feature-list",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        icon: T.string(),
        text: T.string(),
      },
    }),
  },
  theme: {
    "uix-feature-list": "grid grid-cols-1 sm:grid-cols-2 gap-8",
    "uix-feature-list__item": "flex items-start",
    "uix-feature-list__icon": "mr-4 text-green-500",
  },
  render() {
    return html`
      <uix-container class="uix-feature-list">
        ${this.items.map(
          (item) => html`
            <uix-container class="uix-feature-list__item">
              <uix-icon
                class="uix-feature-list__icon"
                name=${item.icon}
              ></uix-icon>
              <uix-text>${item.text}</uix-text>
              <uix-container> </uix-container
            ></uix-container>
          `,
        )}
        <uix-container> </uix-container
      ></uix-container>
    `;
  },
};
export default FeatureList;
