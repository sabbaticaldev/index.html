import { html, T } from "helpers";

const Media = {
  tag: "uix-media",
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
      <img class="uix-media__image" src=${this.src} alt=${this.alt} />
    `;
  },
};

export default Media;
