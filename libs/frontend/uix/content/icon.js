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
      _base: ({ name, iconSet }) => `i-${iconSet}-${name} block`,
    },
    "uix-icon__chevron-up": "i-lucide-chevron-up",
    "uix-icon__chevron-down": "i-lucide-chevron-down",
    "uix-icon__star": "i-lucide-star",
    "uix-icon__users": "i-lucide-users",
    "uix-icon__user": "i-lucide-user",
    "uix-icon__tag": "i-lucide-tag",
    "uix-icon__home": "i-lucide-home",
    "uix-icon__heart": "i-lucide-heart",
    "uix-icon__spinner": "i-lucide-spinner",
    "uix-icon__smartphone": "i-lucide-smartphone",
    "uix-icon__layout": "i-lucide-layout",
    "uix-icon__git-branch": "i-lucide-git-branch",
    "uix-icon__type": "i-lucide-type",
    "uix-icon__clock": "i-lucide-clock",
    "uix-icon__git-commit": "i-lucide-git-commit",
    "uix-icon__git-merge": "i-lucide-git-merge",
    "uix-icon__alert-triangle": "i-lucide-alert-triangle",
    "uix-icon__loader": "i-lucide-loader",
    "uix-icon__bell": "i-lucide-bell",
    "uix-icon__message-circle": "i-lucide-message-circle",
    "uix-icon__bar-chart": "i-lucide-bar-chart",
    "uix-icon__mouse-pointer": "i-lucide-mouse-pointer",
    "uix-icon__edit": "i-lucide-edit",
  },
  render() {
    return html``;
  },
};
