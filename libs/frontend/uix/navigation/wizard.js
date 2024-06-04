import { html, T } from "helpers";

const Wizard = {
  tag: "uix-wizard",
  props: {
    items: T.array({
      type: {
        title: T.string(),
        content: T.string(),
        icon: T.string(),
      },
    }),
    activeStep: T.number({ defaultValue: 0 }),
  },
  theme: {
    "uix-wizard": "space-y-6",
    "uix-wizard__steps": "flex",
    "uix-wizard__step": {
      _base: "flex items-center",
      active: {
        true: "text-blue-600",
        false:
          "text-gray-500 after:content-['/'] after:text-gray-200 after:mx-2",
      },
    },
    "uix-wizard__step-icon": "mr-2",
    "uix-wizard__content": "mt-4",
    "uix-wizard__buttons": "mt-6 flex justify-end space-x-4",
  },
  render() {
    const { items, activeStep } = this;
    const activeStepContent = items[activeStep]?.content;

    return html`
      <div data-theme="uix-wizard__steps">
        ${items.map(
          (item, index) => html`
            <div data-theme="uix-wizard__step">
              ${item.icon
                ? html`<uix-icon
                    data-theme="uix-wizard__step-icon"
                    name=${item.icon}
                  ></uix-icon>`
                : ""}
              ${item.title}
            </div>
          `,
        )}
      </div>
      <div data-theme="uix-wizard__content">${activeStepContent}</div>
      <div data-theme="uix-wizard__buttons">
        <button
          class="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
          ?disabled=${activeStep === 0}
          @click=${() => this.setActiveStep(activeStep - 1)}
        >
          Previous
        </button>
        <button
          class="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
          ?disabled=${activeStep === items.length - 1}
          @click=${() => this.setActiveStep(activeStep + 1)}
        >
          Next
        </button>
      </div>
    `;
  },
};

export default Wizard;
