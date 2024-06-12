import { html, T } from "helpers";
const iconNames = [
  "alert-triangle",
  "align-left",
  "app-window",
  "bar-chart",
  "bell",
  "book",
  "box",
  "calendar",
  "check-square",
  "chevron-down",
  "chevron-up",
  "chevrons-down",
  "chevrons-right",
  "circle",
  "circle-help",
  "clapperboard",
  "clock",
  "code",
  "credit-card",
  "database",
  "droplet",
  "edit",
  "ellipsis-vertical",
  "feather",
  "file-text",
  "git-branch",
  "git-commit",
  "git-merge",
  "grid",
  "hash",
  "heart",
  "heart-pulse",
  "home",
  "image",
  "layout",
  "layout-template",
  "layers",
  "link",
  "list",
  "loader",
  "menu",
  "message-circle",
  "message-square",
  "minus",
  "monitor",
  "more-horizontal",
  "more-vertical",
  "mouse-pointer",
  "navigation",
  "package",
  "paperclip",
  "plus-circle",
  "radio",
  "repeat",
  "search",
  "settings",
  "sidebar",
  "sliders",
  "smile",
  "smartphone",
  "spinner",
  "star",
  "sun",
  "table",
  "tag",
  "tags",
  "toggle-right",
  "type",
  "upload",
  "upload-cloud",
  "user",
  "users",
  "video",
  "wand",
  "x",
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
