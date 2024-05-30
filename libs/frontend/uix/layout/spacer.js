// spacer.js
import { html } from "helpers";

const Spacer = {
  tag: "uix-spacer",
  props: {
    // Define spacer props like size, axis, etc.
  },
  theme: {
    // Define spacer theme classes
  },
  render() {
    return html` <div class=${this.theme("uix-spacer")}></div> `;
  },
};

export default Spacer;
