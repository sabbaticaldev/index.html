// container.js
import { html } from "helpers";

const Container = {
  props: {
    // Define container props like maxWidth, padding, etc.
  },
  theme: {
    // Define container theme classes
  },
  render() {
    return html`
      <div class=${this.theme("uix-container")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Container;
