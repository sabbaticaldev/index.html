import { html, T } from "helpers";

const Container = {
  tag: "uix-container",
  props: {
    width: T.string({ defaultValue: "full" }),
    height: T.string({ defaultValue: "auto" }),
    align: T.string({ defaultValue: "center" }),
    justify: T.string({ defaultValue: "center" }),
    padding: T.string({ defaultValue: "4" }),
    responsive: T.boolean({ defaultValue: false }),
  },
  theme: {
    "uix-container": {
      _base: ({ width, height, align, justify, padding }) =>
        `w-${width} h-${height} flex flex-col items-${align} justify-${justify} p-${padding}`,
      responsive: {
        true: "sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3",
      },
    },
  },
  render() {
    return html` <slot></slot> `;
  },
};

export default Container;
