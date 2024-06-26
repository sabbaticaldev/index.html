import { html, T } from "frontend";
const PricingTable = {
  tag: "uix-pricing-table",
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
      <uix-container>
        ${this.plans.map(
          (plan) => html`
            <uix-card>
              <uix-text class="uix-pricing-plan__name" size="xl"
                >${plan.name}</uix-text
              >
              <uix-text class="uix-pricing-plan__price">${plan.price}</uix-text>
              <uix-button @click=${plan.buttonClick}
                >${plan.buttonText}</uix-button
              >
            </uix-card>
          `,
        )}
        <uix-container> </uix-container
      ></uix-container>
    `;
  },
};
export default PricingTable;
