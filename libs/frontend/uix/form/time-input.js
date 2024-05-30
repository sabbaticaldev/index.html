import { html, T } from "helpers";

const TimeInput = {
  tag: "uix-time-input",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    step: T.string(),
    change: T.function(),
  },
  render() {
    const { value, min, max, step, change } = this;
    return html`
      <input
        type="time"
        .value=${value}
        ?min=${min}
        ?max=${max}
        ?step=${step}
        @change=${change}
      />
    `;
  },
};

export default TimeInput;
