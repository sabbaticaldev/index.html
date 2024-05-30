import { html, T } from "helpers";

const RadioGroup = {
  tag: "uix-radio-group",
  props: {
    name: T.string(),
    options: T.array(),
    value: T.string(),
    change: T.function(),
  },
  render() {
    const { name, options, value, change } = this;
    return html`
      <div>
        ${options.map(
          (option) => html`
            <label>
              <input
                type="radio"
                name=${name}
                value=${option.value}
                ?checked=${value === option.value}
                @change=${change}
              />
              ${option.label}
            </label>
          `,
  )}
      </div>
    `;
  },
};

export default RadioGroup;
