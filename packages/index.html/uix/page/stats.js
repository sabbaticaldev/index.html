import { html, T } from "frontend";
const Stats = {
  tag: "uix-stats",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        value: T.string(),
        label: T.string(),
      },
    }),
  },
  theme: {
    "uix-stats": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
    "uix-stat": "text-center",
    "uix-stat__value": "text-4xl font-bold mb-2",
    "uix-stat__label": "text-gray-600",
  },
  render() {
    return html`
      <uix-container class="uix-stats">
        ${this.items.map(
          (item) => html`
            <uix-container class="uix-stat">
              <uix-text class="uix-stat__value" size="2xl"
                >${item.value}</uix-text
              >
              <uix-text class="uix-stat__label">${item.label}</uix-text>
            </uix-container>
          `,
        )}
        <uix-container> </uix-container
      ></uix-container>
    `;
  },
};
export default Stats;
