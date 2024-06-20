import { html } from "./libs/lit.js";
import ReactiveView from "./reactive-view/base.js";
class IndexHtml extends ReactiveView {
  render() {
    return html`<slot></slot>`;
  }
}

export default ReactiveView.define("index-html", IndexHtml);
