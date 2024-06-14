import { html, T, genTheme } from "helpers";

const CardBody = {
  tag: "uix-card-body",
  props: {
    spacing: T.string({ defaultValue: "md" }),
  },
  _theme: {
    "": `p-4`,
    ...genTheme('spacing', ["xs", "sm", "md", "lg", "xl"], (entry) => `p-${entry}`),
  },
  render() {
    return html`
      <slot></slot>
    `;
  },
};

export default CardBody;
