import { html, T } from "helpers";

const Code = {
  tag: "uix-code",
  props: {
    code: T.string(),
    language: T.string({ defaultValue: "html" }),
  },
  theme: {
    "uix-code": "bg-gray-100 p-4 overflow-x-auto",
    "uix-code__pre": "m-0",
    "uix-code__code": "text-sm",
  },
  render() {
    return html`
      <div data-theme="uix-code">
        <pre data-theme="uix-code__pre">
          <code
            data-theme="uix-code__code"
            class="language-${this.language}"
          >${this.code}</code>
        </pre>
      </div>
    `;
  },
};

export default Code;
