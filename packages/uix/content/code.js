import { ReactiveView } from "frontend";
import { html, T } from "frontend";

class Code extends ReactiveView {
  static get properties() {
    return {
      code: T.string(),
      language: T.string({ defaultValue: "html" }),
    };
  }

  static theme = {
    "": "bg-gray-100 p-4 overflow-x-auto",
    ".uix-code__pre": "m-0",
    ".uix-code__code": "text-sm",
  };

  render() {
    return html`
      <div class="uix-code">
        <pre class="uix-code__pre">
          <code
            class="uix-code__code"
            class="language-${this.language}"
          >${this.code}</code>
        </pre>
      </div>
    `;
  }
}

export default ReactiveView.define("uix-code", Code);
