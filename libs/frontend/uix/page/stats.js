import { html, T } from "helpers";
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
    "uix-stats__element":
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
    "uix-stat": "text-center",
    "uix-stat__value": "text-4xl font-bold mb-2",
    "uix-stat__label": "text-gray-600",
  },
  render() {
    return html`
      <uix-list class=${this.theme("uix-stats__element")}>
        ${this.items.map(
    (item) => html`
            <uix-block class=${this.theme("uix-stat")}>
              <uix-text class=${this.theme("uix-stat__value")} size="2xl"
                >${item.value}</uix-text
              >
              <uix-text class=${this.theme("uix-stat__label")}
                >${item.label}</uix-text
              >
            </uix-block>
          `,
  )}
      </uix-list>
    `;
  },
};
export default Stats;
