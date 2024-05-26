import { html, T } from "helpers";

export default {
  props: {
    label: T.string(),
    spacing: T.string({ default: "md" }),
  },
  theme: ({ SpacingSizes }) => ({
    "uix-divider": {
      _base: "flex items-center my-2",
      spacing: SpacingSizes,
    },
    "uix-divider__border": "border-t border-gray-400 flex-grow",
    "uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
  }),
  render() {
    return html`
      <div class=${this.theme("uix-divider")}>
        <div class=${this.theme("uix-divider__border")}></div>
        ${this.label &&
        html`
          <div class=${this.theme("uix-divider__label")}>${this.label}</div>
          <div class=${this.theme("uix-divider__border")}></div>
        `}
      </div>
    `;
  },
};
