import { datetime, html, T } from "frontend";

export default {
  tag: "uix-time",
  props: { timestamp: T.number() },
  theme: {
    "uix-time": "whitespace-nowrap",
  },
  render() {
    return html`<time class="uix-time"
      >${datetime.formatTime(this.timestamp)}</time
    >`;
  },
};
