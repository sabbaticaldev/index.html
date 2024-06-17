import "../layout/container.js";
import "./icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";

class Rating extends ReactiveView {
  static get properties() {
    return {
      value: T.number({ defaultValue: 0 }),
      max: T.number({ defaultValue: 5 }),
      readonly: T.boolean({ defaultValue: false }),
      change: T.function(),
    };
  }

  static theme = {
    ".uix-rating__container": "[&_[filled]]:text-yellow",
    ".uix-rating__star": "w-5 h-5",
  };

  render() {
    const { value, max, readonly, change } = this;

    return html`
      <uix-container horizontal class="uix-rating__container">
        ${Array.from({ length: max }, (_, index) => {
          const isFilled = index < value;
          const isHalf = index + 0.5 === value;
          return html`
            <uix-icon
              name=${isHalf ? "star-half" : "star"}
              ?filled=${isFilled}
              @click=${() => !readonly && change(index + 1)}
            ></uix-icon>
          `;
        })}
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-rating", Rating);
