// flex.js
import { html } from "helpers";

const Flex = {
  props: {
    // Define flex props like direction, wrap, justify, align, etc.
  },
  theme: {
    // Define flex theme classes
  },
  render() {
    return html`
      <div class=${this.theme("uix-flex")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Flex;
