import { staticHtml, T, unsafeStatic } from "helpers";

const TAG_MAP = {
  "4xl": "h1",
  "3xl": "h2",
  "2xl": "h2",
  xl: "h2",
  lg: "h3",
  md: "h4",
  sm: "h5",
  xs: "h6",
};

const Text = {
  tag: "uix-text",
  props: {
    size: T.string({}),
    variant: T.string({ defaultValue: "default" }),
    weight: T.string({ defaultValue: "" }),
    font: T.string({ defaultValue: "sans" }),
    transform: T.string(),
    href: T.string(),
    onclick: T.function(),
    leading: T.string({}),
  },
  theme: ({
    TextColors,
    FontWeight,
    FontType,
    LeadingSizes,
    TrackingSizes,
    TextSizes,
  }) => ({
    "uix-text": {
      _base: "",
      variant: TextColors,
      transform: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },

      weight: FontWeight,
      font: FontType,
      leading: LeadingSizes,
      size: [LeadingSizes, TrackingSizes, TextSizes],
    },
  }),
  render() {
    const { size } = this;
    const tag = TAG_MAP[size] || "p";

    return staticHtml`
      <${unsafeStatic(tag)}>
        <slot></slot>
      </${unsafeStatic(tag)}>
    `;
  },
};

export default Text;
