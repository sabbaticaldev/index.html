import { css, droparea, staticHtml, T, unsafeStatic } from "helpers";

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
    rounded: T.boolean(),
    containerClass: T.string(),
  },
  theme: ({ JustifyContent, SpacingSizes, Gaps }) => ({
    "uix-list": {
      _base: "flex",
      spacing: SpacingSizes,
      gap: Gaps,
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
    const { tag } = this;
    return staticHtml`
      <${unsafeStatic(tag)} class=${this.theme("uix-list")}>
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};
