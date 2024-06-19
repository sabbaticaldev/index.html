import "../layout/container.js";
import "./avatar.js";

import { ReactiveView } from "frontend";
import { html, T } from "frontend";

class AvatarGroup extends ReactiveView {
  static get properties() {
    return {
      count: T.number(),
    };
  }

  static theme = {
    "": "flex -space-x-2",
    ".uix-avatar-group__more":
      "flex items-center justify-center bg-gray-800 text-white rounded-full",
  };

  render() {
    const avatars = this.querySelectorAll("uix-avatar");
    const visibleAvatars = Array.from(avatars).slice(0, 3);
    const moreCount = this.count - 3;

    return html`
      <uix-container horizontal gap="stack">
        ${visibleAvatars}
        ${this.count && moreCount > 0
          ? html` <uix-avatar> +${moreCount} </uix-avatar> `
          : ""}
        <slot></slot>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-avatar-group", AvatarGroup);
