import { datetime, html, T } from "helpers";

export default {
  props: { timestamp: T.number() },
  theme: {
    "uix-time": "whitespace-nowrap",
  },
  render() {
    return html`<time class=${this.theme("uix-time")}
      >${datetime.formatTime(this.timestamp)}</time
    >`;
  },
};
