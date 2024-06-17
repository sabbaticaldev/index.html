import { ReactiveView } from "frontend";
import { html, T } from "helpers";

class DocsExample extends ReactiveView {
  static get properties() {
    return {
      code: T.string(),
      demo: T.function(),
    };
  }

  static theme = {
    ".uix-docs-example__demo": "mb-4",
    ".uix-docs-example__code": "bg-gray-100 p-4 overflow-x-auto",
  };

  render() {
    return html`
      <div data-theme="uix-docs-example__demo">${this.demo()}</div>
      <uix-code
        data-theme="uix-docs-example__code"
        .code=${this.code}
        language="html"
      ></uix-code>
    `;
  }
}

export default ReactiveView.define("uix-docs-example", DocsExample);
