import { html, T } from "helpers";

const Stats = {
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
      <div class=${this.theme("uix-stats")}>
        ${this.items.map(
          (item) => html`
            <div class=${this.theme("uix-stat")}>
              <uix-text class=${this.theme("uix-stat__value")} size="2xl"
                >${item.value}</uix-text
              >
              <p class=${this.theme("uix-stat__label")}>${item.label}</p>
            </div>
          `,
  )}
      </div>
    `;
  },
};

export default Stats;
