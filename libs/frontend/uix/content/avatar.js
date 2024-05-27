import { html, T } from "helpers";

const Avatar = {
  props: {
    src: T.string(),
    alt: T.string({ defaultValue: "" }),
    size: T.string({ defaultValue: "sm" }),
    placeholder: T.string({ defaultValue: "" }),
  },
  theme: ({ DimensionSizes, commonStyles }) => ({
    "uix-avatar": { ...commonStyles, size: DimensionSizes },
    "uix-avatar__img": { _base: "", size: DimensionSizes },
  }),
  render() {
    const { src, alt, placeholder } = this;
    let content;
    if (src) {
      content = html`<img
        src=${src}
        class=${this.theme("uix-avatar__img")}
        alt=${alt}
      />`;
    } else if (placeholder) {
      content = html`<span class=${this.theme("uix-avatar__img")}
        >${placeholder}</span
      >`;
    }

    return html` <div class=${this.theme("uix-avatar")}>${content}</div> `;
  },
};

export default Avatar;