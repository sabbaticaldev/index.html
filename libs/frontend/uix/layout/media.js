import { html, T } from "helpers";

const Media = {
  props: {
    src: T.string(),
    alt: T.string(),
    aspectRatio: T.string({ defaultValue: "16/9" }),
  },
  theme: {
    "uix-media": ({ aspectRatio }) => `aspect-${aspectRatio}`,
    "uix-media__image": "w-full h-full object-cover",
  },
  render() {
    return html`
      <div class=${this.theme("uix-media")}>
        <img
          class=${this.theme("uix-media__image")}
          src=${this.src}
          alt=${this.alt}
        />
      </div>
    `;
  },
};

export default Media;