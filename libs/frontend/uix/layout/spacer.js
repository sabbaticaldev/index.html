import { html, T } from "helpers";

const Spacer = {
  tag: "uix-spacer",
  props: {
    size: T.string({ default: "md" }),
    horizontal: T.boolean({ default: false }),
  },
  theme: ({ SpacingSizes }) => ({
    "uix-spacer": ({ size, horizontal }) =>
      horizontal ? `w-${SpacingSizes[size]}` : `h-${SpacingSizes[size]}`,
  }),
  render() {
    return html``;
  },
};

export default Spacer;
