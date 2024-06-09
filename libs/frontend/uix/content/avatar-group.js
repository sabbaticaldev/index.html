import { html, T } from "helpers";

export default {
  tag: "uix-avatar-group",
  props: {
    avatars: T.array({
      defaultValue: [],
      type: {
        src: T.string(),
        alt: T.string(),
      },
    }),
    size: T.string({ defaultValue: "sm" }),
    max: T.number({ defaultValue: 3 }),
  },
  theme: {
    "uix-avatar-group": "flex -space-x-2",
    "uix-avatar-group__avatar": {
      _base: "inline-block rounded-full ring-2 ring-white",
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    "uix-avatar-group__extra":
      "inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
  },
  render() {
    const { avatars, max } = this;
    const displayedAvatars = avatars.slice(0, max);
    const extraAvatars = avatars.length - max;

    return html`
      ${displayedAvatars.map(
        (avatar) => html`
          <img
            data-theme="uix-avatar-group__avatar"
            src=${avatar.src}
            alt=${avatar.alt}
          />
        `,
      )}
      ${extraAvatars > 0 &&
      html`
        <span data-theme="uix-avatar-group__extra"> +${extraAvatars} </span>
      `}
    `;
  },
};
