import { ReactiveView } from "frontend";
import { genTheme, html, sizeMap, spacingMap, T } from "frontend";

class Divider extends ReactiveView {
  static get properties() {
    return {
      label: T.string(),
      padding: T.string(),
    };
  }

  static theme = {
    "": "w-full block flex items-center",
    ".uix-divider__border":
      "h-px bg-gray-400 m-0 border-0 dark:bg-gray-700 flex-grow",
    ".uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
    ...genTheme(
      "padding",
      Object.keys(sizeMap),
      (entry) => `py-${spacingMap[entry]}`,
    ),
  };

  render() {
    return html`
      <hr class="uix-divider__border" />
      ${this.label &&
      html`
        <div class="uix-divider__label">${this.label}</div>
        <hr class="uix-divider__border" />
      `}
    `;
  }
}

export default ReactiveView.define("uix-divider", Divider);
