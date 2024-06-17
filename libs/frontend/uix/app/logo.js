import "../content/icon.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";
class Logo extends ReactiveView {
  static get properties() {
    return {
      icon: T.string(),
      name: T.string(),
      iconImage: T.string(),
      nameImage: T.string(),
      image: T.string(),
    };
  }

  render() {
    const { icon, name, iconImage, nameImage, image } = this;

    return html`
      ${image
        ? html`<img src=${image} alt=${name} />`
        : html`
            ${iconImage
              ? html`<img src=${iconImage} alt="" />`
              : icon
              ? html`<uix-icon name=${icon}></uix-icon>`
              : ""}
            ${nameImage
              ? html`<img src=${nameImage} alt=${name} />`
              : name
              ? html`<span>${name}</span>`
              : ""}
          `}
    `;
  }
}

export default ReactiveView.define("uix-logo", Logo);
