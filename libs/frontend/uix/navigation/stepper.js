import { html, T } from "helpers";

const Stepper = {
  tag: "uix-stepper",
  props: {
    activeStep: T.number({ defaultValue: 0 }),
    vertical: T.boolean({ defaultValue: false }),
  },
  theme: {
    "uix-stepper": {
      _base: "flex",
      vertical: {
        true: "flex-col space-y-4",
        false: "space-x-4",
      },
    },
    "uix-stepper-item": "flex items-center",
    "uix-stepper-item__marker": {
      _base: "flex items-center justify-center w-8 h-8 rounded-full border-2",
      active: {
        true: "bg-blue-600 text-white border-blue-600",
        false: "border-gray-300",
      },
    },
    "uix-stepper-item__label": "ml-2 text-sm",
    "uix-stepper-item__icon": "mr-1",
  },
  render() {
    return html`
      <div data-theme="uix-stepper">
        <slot></slot>
      </div>
    `;
  },
};

const StepperItem = {
  tag: "uix-stepper-item",
  props: {
    label: T.string(),
    icon: T.string(),
    href: T.string(),
    active: T.boolean({ defaultValue: false }),
  },
  render() {
    return html`
      <div data-theme="uix-stepper-item">
        ${this.icon
          ? html`
              <uix-icon
                name=${this.icon}
                data-theme="uix-stepper-item__icon"
              ></uix-icon>
            `
          : ""}
        <span data-theme="uix-stepper-item__marker"></span>
        ${this.href
          ? html`
              <uix-link href=${this.href} data-theme="uix-stepper-item__label"
                >${this.label}</uix-link
              >
            `
          : html`
              <span data-theme="uix-stepper-item__label">${this.label}</span>
            `}
      </div>
    `;
  },
};

export default Stepper;
export { StepperItem };
