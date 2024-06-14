import { html, defaultTheme, T, genTheme } from "helpers";

const CardHeader = {
  tag: "uix-card-header",
  props: {
    spacing: T.string({ defaultValue: "md" }),
  },
  _theme: {
    "": `px-4 py-2`,
    ...genTheme('spacing', ["xs", "sm", "md", "lg", "xl"], (entry) => `p-${entry}`),
  },
  render() {
    return html`
      <slot></slot>
    `;
  },
};

export default CardHeader;
