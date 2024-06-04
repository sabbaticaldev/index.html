import { html, T } from "helpers";

const Container = {
  tag: "uix-container",
  props: {
    width: T.string({ defaultValue: "full" }),
    height: T.string({ defaultValue: "auto" }),
    align: T.string({ defaultValue: "stretch" }),
    flex: T.boolean({ defaultValue: true }),
    justify: T.string(),
    padding: T.string({ defaultValue: "4" }),
    secondary: T.boolean({ defaultValue: false }),
    vertical: T.boolean({ defaultValue: true }),
    responsive: T.boolean(),
    reverse: T.boolean(),
    droparea: T.boolean(),
    grow: T.boolean(),
    spacing: T.string({ defaultValue: "sm" }),
    gap: T.string({ defaultValue: "sm" }),
    wrap: T.string({ defaultValue: "nowrap" }),
    rounded: T.boolean(),
  },
  theme: ({ baseTheme, SpacingSizes, JustifyContent, Gaps, WidthSizes }) => ({
    "uix-container": {
      _base: ({ secondary }) =>
        `block h-auto min-h-screen ${
          secondary
            ? baseTheme.backgroundSecondaryColor
            : baseTheme.backgroundColor
        }`,
      flex: { true: "flex" },
      spacing: SpacingSizes,
      grow: { true: "grow-1", false: "grow-0" },
      gap: Gaps,
      justify: JustifyContent,
      vertical: { true: "flex-col" },
      responsive: {
        true: "lg:flex-col sm:flex-row",
        false: "sm:flex-col lg:flex-row",
      },
      reverse: {
        true: "flex-col-reverse",
        false: "flex-row-reverse",
      },

      width: WidthSizes,
    },
  }),
  render() {
    return html`<slot></slot> `;
  },
};

export default Container;
