import { html, T } from "helpers";

const FeatureBlock = {
  props: {
    icon: T.string(),
    title: T.string(),
    description: T.string(),
  },
  theme: {
    "uix-feature-block": "flex flex-col items-center text-center",
    "uix-feature-block__icon": "mb-4 text-4xl",
    "uix-feature-block__title": "mb-2 text-xl font-semibold",
    "uix-feature-block__description": "text-gray-600",
  },
  render() {
    return html`
      <div class=${this.theme("uix-feature-block")}>
        <uix-icon
          class=${this.theme("uix-feature-block__icon")}
          name=${this.icon}
        ></uix-icon>
        <uix-text class=${this.theme("uix-feature-block__title")} size="xl"
          >${this.title}</uix-text
        >
        <p class=${this.theme("uix-feature-block__description")}>
          ${this.description}
        </p>
      </div>
    `;
  },
};

export default FeatureBlock;
