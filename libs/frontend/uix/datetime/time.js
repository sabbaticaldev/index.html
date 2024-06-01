import { datetime, html, T } from "helpers";

export default {
  tag: "uix-time",
  props: { timestamp: T.number() },
  theme: {
    "uix-time": "whitespace-nowrap",
  },
  render() {
    return html`<time data-theme="uix-time"
      >${datetime.formatTime(this.timestamp)}</time
    >`;
  },
};
