import { html, T, spacingMap, sizeMap, genTheme } from "helpers";

export default {
  tag: "uix-divider",
  props: {
    label: T.string(),
    padding: T.string({ defaultValue: "md" }),
  },
  _theme: {
    "": "w-full block flex items-center",
    ".uix-divider__border": "border-t border-gray-400 flex-grow",
    ".uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
    ...genTheme('padding', Object.keys(sizeMap), (entry) => `py-${spacingMap[entry]}`),
  },
  render() {
    return html`
      <div class="uix-divider__border"></div>
      ${this.label &&
      html`
        <div class="uix-divider__label">${this.label}</div>
        <div class="uix-divider__border"></div>
      `}
    `;
  },
};
