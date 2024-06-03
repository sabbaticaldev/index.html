import { html, T } from "helpers";

export default {
  tag: "uix-icon",
  props: {
    iconSet: T.string({ defaultValue: "lucide" }),
    name: T.string(),
    size: T.string({ defaultValue: "" }),
  },
  theme: {
    "uix-icon": {
      _base: ({ name, iconSet }) => `i-${iconSet}-${name}`,
      "uix-icon__chevron-up": "i-lucide-chevron-up",
      "uix-icon__chevron-down": "i-lucide-chevron-down",
    },
  },
  render() {
    return html``;
  },
};
