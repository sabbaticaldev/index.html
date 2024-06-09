import { html, T } from "helpers";
export default {
  tag: "uix-date-input",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    change: T.function(),
  },
  render() {
    const { value, min, max, change } = this;
    return html`
      <input
        type="date"
        .value=${value}
        ?min=${min}
        ?max=${max}
        @change=${change}
      />
    `;
  },
};
