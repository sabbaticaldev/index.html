import { html, T } from "helpers";
const PricingTable = {
  props: {
    plans: T.array({
      defaultValue: [],
      type: {
        name: T.string(),
        price: T.string(),
        buttonText: T.string(),
        buttonClick: T.function(),
      },
    }),
  },
  theme: {
    "uix-pricing-table": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
    "uix-pricing-plan": "bg-white shadow-lg rounded-lg p-6 text-center",
    "uix-pricing-plan__name": "text-xl font-semibold mb-4",
    "uix-pricing-plan__price": "text-3xl font-bold mb-4",
  },
  render() {
    return html`
      <uix-list class=${this.theme("uix-pricing-table")}>
        ${this.plans.map(
    (plan) => html`
            <uix-block class=${this.theme("uix-pricing-plan")}>
              <uix-text class=${this.theme("uix-pricing-plan__name")} size="xl"
                >${plan.name}</uix-text
              >
              <uix-text class=${this.theme("uix-pricing-plan__price")}
                >${plan.price}</uix-text
              >
              <uix-button @click=${plan.buttonClick}
                >${plan.buttonText}</uix-button
              >
            </uix-block>
          `,
  )}
      </uix-list>
    `;
  },
};
export default PricingTable;
