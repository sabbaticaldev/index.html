// stack.js
import { html } from "helpers";

const Stack = {
  props: {
    // Define stack props like direction, spacing, etc.
  },
  theme: {
    // Define stack theme classes
  },
  render() {
    return html`
      <div class=${this.theme("uix-stack")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Stack;
