import { html, T } from "helpers";

const Flex = {
  tag: "uix-flex",
  props: {
    direction: T.string({ defaultValue: "row" }),
    wrap: T.string({ defaultValue: "nowrap" }),
    justify: T.string({ defaultValue: "start" }),
    align: T.string({ defaultValue: "stretch" }),
    gap: T.string({ defaultValue: "0" }),
  },
  theme: {
    "uix-flex": ({ direction, wrap, justify, align, gap }) =>
      `flex flex-${direction} flex-${wrap} justify-${justify} items-${align} gap-${gap}`,
  },
  render() {
    return html`
      <div class=${this.theme("uix-flex")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Flex;
