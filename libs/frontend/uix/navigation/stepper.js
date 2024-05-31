import { html, T } from "helpers";

const Stepper = {
  tag: "uix-stepper",
  props: {
    steps: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        active: T.boolean({ defaultValue: false }),
      },
    }),
  },
  theme: {
    "uix-stepper": "flex space-x-4",
    "uix-stepper__step": ({ active }) => ({
      _base: "flex items-center",
      active: {
        true: "text-blue-600",
        false: "text-gray-500",
      },
    }),
    "uix-stepper__marker": ({ active }) => ({
      _base:
        "flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300",
      active: {
        true: "bg-blue-600 text-white border-blue-600",
        false: "",
      },
    }),
    "uix-stepper__label": "ml-2",
  },
  render() {
    return html`
      ${this.steps.map(
    (step, index) => html`
          <div
            class=${this.theme("uix-stepper__step", { active: step.active })}
          >
            <span
              class=${this.theme("uix-stepper__marker", {
    active: step.active,
              })}
              >${index + 1}</span
            >
            <span class=${this.theme("uix-stepper__label")}>${step.label}</span>
          </div>
        `,
  )}
    `;
  },
};

export default Stepper;
