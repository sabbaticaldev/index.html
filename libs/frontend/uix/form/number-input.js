import { html, T } from "helpers";

const NumberInput = {
  props: {
    value: T.number(),
    min: T.number(),
    max: T.number(),
    step: T.number(),
    change: T.function(),
  },
  render() {
    const { value, min, max, step, change } = this;
    return html`
      <input
        type="number"
        .value=${value}
        ?min=${min}
        ?max=${max}
        ?step=${step}
        @change=${change}
      />
    `;
  },
};

export default NumberInput;
