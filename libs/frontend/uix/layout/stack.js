import { html, T } from "helpers";

const Stack = {
  props: {
    spacing: T.string({ defaultValue: "0" }),
    direction: T.string({ defaultValue: "column" }),
  },
  theme: {
    "uix-stack": ({ spacing, direction }) =>
      `flex flex-${direction} space-${direction}-${spacing}`,
  },
  render() {
    return html`
      <div class=${this.theme("uix-stack")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Stack;
