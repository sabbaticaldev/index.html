import { ReactiveView } from "frontend";
import { escapeHTML, html, T, unsafeHTML } from "frontend";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const renderer = new marked.Renderer();
renderer.code = function (code) {
  if (code.lang === "html")
    return `<uix-container horizontal gap="lg" padding="md" justify="evenly" items="center">${code?.text}</uix-container>`;
  return `<pre><code>${escapeHTML(code?.text)}</code></pre>`;
};

class AppContent extends ReactiveView {
  static properties = {
    design: T.string({ sync: "url", defaultValue: "form--button" }),
    markdown: T.string(),
  };

  loadMarkdown() {
    const componentPath = this.design.split("--");
    if (!componentPath.length === 2) return;
    fetch(`/components/${componentPath.join("/")}.md`).then((response) => {
      import(["/uix", ...componentPath].join("/") + ".js").then(() => {
        ReactiveView.unoRuntime();
        ReactiveView.install(true);
        if (response.ok) {
          response.text().then((markdown) => {
            this.markdown = markdown;
          });
        }
      });
    });
  }
  willUpdate(updatedProperties) {
    if (
      updatedProperties.has("design") &&
      updatedProperties.get("design") !== this.design
    ) {
      this.loadMarkdown();
      return true;
    }
    return false;
  }
  render() {
    const { markdown = "" } = this;
    return html`
      <uix-container grow padding="md" max-resolution="lg">
        ${unsafeHTML(marked(markdown, { renderer }))}
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-content", AppContent);
