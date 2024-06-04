import { css, html, T } from "helpers";

const Stepper = {
  tag: "uix-stepper",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        active: T.boolean({ defaultValue: false }),
      },
    }),
    activeStep: T.number({ defaultValue: 0 }),
  },
  theme: {
    "uix-stepper": "flex space-x-4",
    "uix-stepper__step": {
      _base: "flex items-center",
      active: {
        true: "text-blue-600",
        false: "text-gray-500",
      },
    },
    "uix-stepper__marker": {
      _base:
        "flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300",
      active: {
        true: "bg-blue-600 text-white border-blue-600",
        false: "",
      },
    },
    "uix-stepper__label": "ml-2 text-sm",
  },
  style: css`
    uix-stepper {
      counter-reset: step;
    }
    .uix-stepper__marker::before {
      counter-increment: step;
      content: counter(step);
    }
  `,
  render() {
    return this.items.map((step, index) => {
      const isActive = index === this.activeStep;
      return html` <div data-theme="uix-stepper__step">
        <span
          data-theme=${`uix-stepper__marker ${
            isActive ? "uix-stepper__marker--active" : ""
          }`}
        ></span>
      </div>`;
    });
  },
};

export default Stepper;
