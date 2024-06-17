import { ReactiveView } from "frontend";
import { html, T } from "helpers";

class Accordion extends ReactiveView {
  static get properties() {
    return {
      multiple: T.boolean(),
      border: T.boolean(),
    };
  }

  static theme = {
    "": "divide-y divide-gray-800 block text-left",
  };

  render() {
    return html`<slot></slot>`;
  }
}

export default ReactiveView.define("uix-accordion", Accordion);
