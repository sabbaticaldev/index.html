import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, T } from "helpers";

const iconNames = [
  "alert-triangle",
  "align-left",
  "app-window",
  "bar-chart",
  "bell",
  "book",
  "box",
  "calendar",
  "check",
  "star",
  "star-half",
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
  "user",
  "settings",
  "log-out",
  "chevron-right",
  "message-circle",
  "message-square",
  "square",
  "x",
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
console.log({ ReactiveView });
class Icon extends ReactiveView {
  static get properties() {
    return {
      name: T.string(),
      size: T.string({ defaultValue: "" }),
    };
  }

  static theme = {
    "": "block",
    ...genTheme(
      "name",
      iconNames,
      (entry) => `i-${defaultTheme.iconFontFamily}-${entry}`,
    ),
  };

  render() {
    return html`<i class=${this.size ? `i-${this.size}` : ""}></i>`;
  }
}

export default ReactiveView.define("uix-icon", Icon);
