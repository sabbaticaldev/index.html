import { html, T } from "helpers";

const Icon = {
  props: {
    name: T.string(),
    size: T.string({ defaultValue: "" }),
    containerClass: T.string(),
  },
  render() {
    const { name } = this;
    return html`<ion-icon name=${name} role="img"></ion-icon>`;
  },
};

export default Icon;
