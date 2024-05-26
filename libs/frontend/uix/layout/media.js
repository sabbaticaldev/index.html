// media.js
import { html } from "helpers";

const Media = {
  props: {
    // Define media props like src, alt, aspectRatio, etc.
  },
  theme: {
    // Define media theme classes
  },
  render() {
    return html`
      <div class=${this.theme("uix-media")}>
        <img src=${this.src} alt=${this.alt} />
      </div>
    `;
  },
};

export default Media;
