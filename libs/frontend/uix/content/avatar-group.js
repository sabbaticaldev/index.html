import { html, T } from "helpers";

const AvatarGroup = {
  tag: "uix-avatar-group",
  props: {
    count: T.number(),    
  },
  _theme: {
    "": "flex -space-x-2",
    ".uix-avatar-group__more": "flex items-center justify-center bg-gray-800 text-white rounded-full",
  },
  render() {
    const avatars = this.querySelectorAll('uix-avatar');
    const visibleAvatars = Array.from(avatars).slice(0, 3);
    const moreCount = this.count - 3;

    return html`
      <uix-container horizontal gap="stack">
        ${visibleAvatars}
        ${this.count && moreCount > 0
          ? html`
              <uix-avatar>
                +${moreCount}
              </uix-avatar>
            `
          : ""}
        <slot></slot>
      </uix-container>
    `;
  },
};

export default AvatarGroup;
