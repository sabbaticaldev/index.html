import { html, T } from "helpers";
const FeatureBlock = {
  tag: "uix-feature-block",
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
      <uix-block class=${this.theme("uix-feature-block")}>
        <uix-icon
          class=${this.theme("uix-feature-block__icon")}
          name=${this.icon}
        ></uix-icon>
        <uix-text class=${this.theme("uix-feature-block__title")} size="xl"
          >${this.title}</uix-text
        >
        <uix-text class=${this.theme("uix-feature-block__description")}
          >${this.description}</uix-text
        >
      </uix-block>
    `;
  },
};
export default FeatureBlock;
