import { html, T } from "helpers";

const Badge = {
  tag: "uix-badge",
  props: {
    size: T.string({ defaultValue: "xs" }),
    variant: T.string({ defaultValue: "default" }),
    icon: T.string({ defaultValue: null }),
  },
  theme: ({ SpacingSizes, TextSizes, commonStyles }) => ({
    "uix-badge": {
      ...commonStyles,
      size: [SpacingSizes, TextSizes],
    },
  }),
  render() {
    return html` <slot></slot>`;
  },
};

export default Badge;
