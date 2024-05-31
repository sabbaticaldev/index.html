import { html, T } from "helpers";

export default {
  tag: "uix-block",
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
    containerClass: T.string(),
    full: T.boolean(),
  },
  theme: ({ SpacingSizes, BaseVariants }) => ({
    "uix-block": {
      spacing: SpacingSizes,
      variant: BaseVariants,
      full: { true: "w-full h-full" },
    },
  }),
  render() {
    return html` <slot></slot> `;
  },
};
