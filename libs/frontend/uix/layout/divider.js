import { html, T } from "helpers";

/**
 * Divider component documentation
 *
 * The Divider component is used to separate content with a horizontal line and optional label.
 *
 * ## Usage
 *
 * ```html
 * <uix-divider></uix-divider>
 * <uix-divider label="Label"></uix-divider>
 * ```
 *
 * ## Props
 *
 * - `label`: The label text for the divider. Optional.
 * - `spacing`: The spacing size for the divider. Possible values are "sm", "md", "lg". Default is "md".
 *
 */
export default {
  props: {
    label: T.string(),
    spacing: T.string({ default: "md" }),
  },
  theme: ({ cls, SpacingSizes }) => ({
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
