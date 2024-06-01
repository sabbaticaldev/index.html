import { html, T } from "helpers";

const Wizard = {
  tag: "uix-wizard",
  props: {
    steps: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        content: T.string(),
      },
    }),
    activeStep: T.number({ defaultValue: 0 }),
  },
  theme: {
    "uix-wizard": "space-y-4",
    "uix-wizard__steps": "flex justify-between",
    "uix-wizard__step": {
      _base: "flex-1 text-center",
      active: {
        true: "text-blue-600 font-bold",
        false: "text-gray-500",
      },
    },
    "uix-wizard__content": "mt-4",
    "uix-wizard__buttons": "mt-4 flex justify-between",
  },
  render() {
    const { steps, activeStep } = this;
    const activeStepContent = steps[activeStep]?.content;

    return html`
      <div data-theme="uix-wizard__steps">
        ${steps.map(
          (step) => html`
            <div data-theme="uix-wizard__step">${step.label}</div>
          `,
        )}
      </div>
      <div data-theme="uix-wizard__content">${activeStepContent}</div>
      <div data-theme="uix-wizard__buttons">
        <button
          ?disabled=${activeStep === 0}
          @click=${() => this.setActiveStep(activeStep - 1)}
        >
          Previous
        </button>
        <button
          ?disabled=${activeStep === steps.length - 1}
          @click=${() => this.setActiveStep(activeStep + 1)}
        >
          Next
        </button>
      </div>
    `;
  },
};

export default Wizard;
