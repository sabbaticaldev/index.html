import { html, T } from "helpers";

const Stepper = {
  tag: "uix-stepper",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        icon: T.string(),
        link: T.string(),
        active: T.boolean({ defaultValue: false }),
      },
    }),
    activeStep: T.number({ defaultValue: 0 }),
  },
  theme: {
    "uix-stepper": "flex space-x-4",
    "uix-stepper__item": {
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
    "uix-stepper__icon": "mr-1",
  },
  render() {
    const renderStep = (step, index) => {
      const isActive = index === this.activeStep;
      const isEditable = step.link && index < this.activeStep;

      return html`
        <li data-theme="uix-stepper__item">
          ${step.icon
            ? html`<uix-icon
                name=${step.icon}
                data-theme="uix-stepper__icon"
              ></uix-icon>`
            : ""}
          <span
            data-theme=${`uix-stepper__marker ${
              isActive ? "uix-stepper__marker--active" : ""
            }`}
            >${index + 1}</span
          >
          ${isEditable
            ? html`
                <uix-link href=${step.link} data-theme="uix-stepper__label"
                  >${step.label}</uix-link
                >
              `
            : html`
                <span data-theme="uix-stepper__label">${step.label}</span>
              `}
        </li>
      `;
    };

    return html`
      <uix-list vertical> ${this.items.map(renderStep)} </uix-list>
    `;
  },
};

export default Stepper;
