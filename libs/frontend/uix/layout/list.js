import { css, droparea, html, T } from "helpers";

export default {
  style: css`
    :host {
      display: inherit;
    }
  `,
  tag: "uix-list",
  props: {
    vertical: T.boolean(),
    responsive: T.boolean(),
    tag: T.string({ defaultValue: "div" }),
    reverse: T.boolean(),
    droparea: T.boolean(),
    justify: T.string(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    wrap: T.string({ defaultValue: "nowrap" }),
    align: T.string(),
    rounded: T.boolean(),
  },
  theme: ({ JustifyContent, SpacingSizes, AlignItems, Gaps }) => ({
    "uix-list": {
      _base: "flex",
      spacing: SpacingSizes,
      gap: Gaps,
      align: AlignItems,
      justify: JustifyContent,
      vertical: { true: "flex-col w-full", false: "h-full" },
      responsive: {
        true: "lg:flex-col sm:flex-row",
        false: "sm:flex-col lg:flex-row",
      },
      reverse: {
        true: "flex-col-reverse",
        false: "flex-row-reverse",
      },
    },
  }),
  ...droparea,
  render() {
    return html`<slot></slot>`;
  },
};
