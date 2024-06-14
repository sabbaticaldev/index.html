import { html, T, defaultTheme, genTheme } from "helpers";

const CardFooter = {
  tag: "uix-card-footer",
  props: {
    padding: T.string({ defaultValue: "md" }),
  },
  _theme: {
    "": `px-4 py-2`,
    ...genTheme('padding', ["xs", "sm", "md", "lg", "xl"], (entry) => `p-${entry}`),
  },
  render() {
    return html`
      <slot></slot>
    `;
  },
};

export default CardFooter;
