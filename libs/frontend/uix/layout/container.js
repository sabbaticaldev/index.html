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
    secondary: T.boolean({ defaultValue: false }),
  },
  theme: ({ baseTheme, WidthSizes }) =>
    !console.log({ WidthSizes }) && {
      "uix-container": {
        _base: ({ secondary }) =>
          `block h-auto min-h-screen ${
            secondary
              ? baseTheme.backgroundSecondaryColor
              : baseTheme.backgroundColor
          }`,

        width: WidthSizes,
        responsive: {
          true: "sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3",
        },
      },
    },
  render() {
    return html`
      <div data-theme="uix-container">
        <slot></slot>
      </div>
    `;
  },
};

export default Container;
