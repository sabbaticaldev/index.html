import { html, T } from "helpers";

const MockupCode = {
  tag: "uix-mockup-code",
  props: {
    code: T.string(),
    language: T.string({ defaultValue: "html" }),
  },
  theme: {
    "uix-mockup-code": "bg-gray-800 p-4 overflow-x-auto rounded-lg shadow-lg",
    "uix-mockup-code__pre": "m-0",
    "uix-mockup-code__code": "text-sm text-white",
  },
  render() {
    return html`
      <div data-theme="uix-mockup-code">
        <pre data-theme="uix-mockup-code__pre">
          <code
            data-theme="uix-mockup-code__code"
            class="language-${this.language}"
          >${this.code}</code>
        </pre>
      </div>
    `;
  },
};

export default MockupCode;
