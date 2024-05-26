import { css, droparea, staticHtml, T, unsafeStatic } from "helpers";

export default {
  style: css`
    :host {
      display: inherit;
    }
  `,
  props: {
    vertical: T.boolean(),
    responsive: T.boolean(),
    tag: T.string({ defaultValue: "div" }),
    reverse: T.boolean(),
    droparea: T.boolean(),
    justify: T.string(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    full: T.boolean(),
    rounded: T.boolean(),
    containerClass: T.string(),
  },
  theme: ({ JustifyContent, SpacingSizes, Gaps }) => ({
    "uix-list": {
      spacing: SpacingSizes,
      gap: Gaps,
      justify: JustifyContent,
      full: ({ vertical }) => ({ true: vertical ? "w-full" : "h-full" }),
      vertical: { true: "flex-col" },
      responsive: ({ vertical }) => ({
        true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row",
      }),
      reverse: ({ vertical }) => ({
        true: vertical ? "flex-col-reverse" : "flex-row-reverse",
      }),
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
