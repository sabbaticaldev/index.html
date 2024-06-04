import { html, T } from "helpers";
const iconNames = [
  "chevron-up",
  "chevron-down",
  "chevrons-down",
  "chevrons-right",
  "navigation",
  "monitor",
  "star",
  "calendar",
  "app-window",
  "clapperboard",
  "users",
  "table",
  "user",
  "tag",
  "tags",
  "home",
  "heart",
  "heart-pulse",
  "spinner",
  "smartphone",
  "layout",
  "layout-template",
  "git-branch",
  "type",
  "clock",
  "git-commit",
  "git-merge",
  "alert-triangle",
  "loader",
  "bell",
  "message-circle",
  "message-square",
  "bar-chart",
  "mouse-pointer",
  "edit",
  "credit-card",
  "sidebar",
  "box",
  "minus",
  "list",
  "layers",
  "link",
  "more-vertical",
  "droplet",
  "upload-cloud",
  "radio",
  "sliders",
  "toggle-right",
  "wand",
  "package",
  "database",
  "smile",
];

export default {
  tag: "uix-icon",
  props: {
    iconSet: T.string({ defaultValue: "lucide" }),
    name: T.string(),
    size: T.string({ defaultValue: "" }),
  },
  theme: {
    "uix-icon__element": {
      _base: ({ name, iconSet }) => `i-${iconSet}-${name} block`,
    },
    "uix-icon__icons": iconNames.map((name) => "i-lucide-" + name).join(" "),
  },
  render() {
    return html`<i data-theme="uix-icon__element"></i>`;
  },
};

/*

Documentation for LLMs:
We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
    we added a icon property to all sections and packages, now we want to add all icons to the uix-icon component

    import { html, T } from "helpers";
    const iconNames = [
      "chevron-up",
      "chevron-down",
      "navigation",
      "monitor",
      "star",
      "users",
      "user",
      "tag",
      "home",
      "heart",
      "spinner",
      "smartphone",
      "layout",
      "git-branch",
      "type",
      "clock",
      "git-commit",
      "git-merge",
      "alert-triangle",
      "loader",
      "bell",
      "message-circle",
      "bar-chart",
      "mouse-pointer",
      "edit",
    ];

    export default {
      tag: "uix-icon",
      props: {
        iconSet: T.string({ defaultValue: "lucide" }),
        name: T.string(),
        size: T.string({ defaultValue: "" }),
      },
      theme: {
        "uix-icon": {
          _base: ({ name, iconSet }) => \`i-\${iconSet}-\${name} block\`,
        },
        "uix-icon__icons": iconNames.map((name) => "i-lucide-" + name).join(" "),
      },
      render() {
        return html\`\`;
      },
    };

    as you can see we have a big list of icons but still many of the icons in the package.js and sections components are not in the list, please gather all missing and update


as you can see in the example, to be able to use chevron-up icon we added a "chevron-up" entry in iconNames, the same for chevron-down
*/
