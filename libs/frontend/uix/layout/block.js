import { html, T } from "helpers";

export default {
  props: {
    variant: T.string(),
    spacing: T.string({ defaultValue: "md" }),
    containerClass: T.string(),
    full: T.boolean(),
  },
  theme: ({ cls, SpacingSizes, BaseVariants }) => ({
    "uix-block": {
      spacing: SpacingSizes,
      variant: BaseVariants,
      full: { true: "w-full h-full" },
    },
  }),
  render() {
    return html`
      <div class=${this.theme("uix-block")}>
        <slot></slot>
      </div>
    `;
  },
};
