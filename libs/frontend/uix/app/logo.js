import { html, T } from "helpers";

export default {
  tag: "uix-logo",
  props: {
    icon: T.string(),
    name: T.string(),
    iconImage: T.string(),
    nameImage: T.string(),
    image: T.string(),
  },
  render() {
    const { icon, name, iconImage, nameImage, image } = this;

    return html`
      ${image ? html`<img src=${image} alt=${name} />` :
        html`
          ${iconImage ? html`<img src=${iconImage} alt="" />` : icon ? html`<uix-icon name=${icon}></uix-icon>` : ''}
          ${nameImage ? html`<img src=${nameImage} alt=${name} />` : name ? html`<span>${name}</span>` : ''}
        `
      }
    `;
  }
}
