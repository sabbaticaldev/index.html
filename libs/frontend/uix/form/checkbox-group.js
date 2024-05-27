import { html, T } from "helpers";

const CheckboxGroup = {
  props: {
    name: T.string(),
    options: T.array(),
    value: T.array(),
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
                type="checkbox"
                name=${name}
                value=${option.value}
                ?checked=${value.includes(option.value)}
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

export default CheckboxGroup;
