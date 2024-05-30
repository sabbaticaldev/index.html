import { html, T } from "helpers";

const Switch = {
  tag: "uix-switch",
  props: {
    checked: T.boolean(),
    change: T.function(),
  },
  render() {
    const { checked, change } = this;
    return html`
      <label class="switch">
        <input type="checkbox" ?checked=${checked} @change=${change} />
        <span class="slider"></span>
      </label>
    `;
  },
};

export default Switch;
