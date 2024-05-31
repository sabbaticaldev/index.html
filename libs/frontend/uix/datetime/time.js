import { datetime, html, T } from "helpers";

export default {
  tag: "uix-time",
  props: { timestamp: T.number() },
  theme: {
    "uix-time__element": "whitespace-nowrap",
  },
  render() {
    return html`<time class=${this.theme("uix-time__element")}
      >${datetime.formatTime(this.timestamp)}</time
    >`;
  },
};
