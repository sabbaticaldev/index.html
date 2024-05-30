import { html, T } from "helpers";

const DocsExample = {
  tag: "uix-docs-example",
  props: {
    code: T.string(),
    demo: T.function(),
  },
  theme: {
    "uix-docs-example": "",
    "uix-docs-example__demo": "mb-4",
    "uix-docs-example__code": "bg-gray-100 p-4 overflow-x-auto",
  },
  render() {
    return html`
      <div class=${this.theme("uix-docs-example")}>
        <div class=${this.theme("uix-docs-example__demo")}>${this.demo()}</div>
        <uix-code
          class=${this.theme("uix-docs-example__code")}
          .code=${this.code}
          language="html"
        ></uix-code>
      </div>
    `;
  },
};

export default DocsExample;
