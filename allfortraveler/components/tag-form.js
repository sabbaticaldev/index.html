import { html, post, ReactiveView, T } from "frontend";

class AppTagForm extends ReactiveView {
  static get properties() {
    return {
      tag: T.string(),
    };
  }

  setTag(tag) {
    this.tag = tag;
    this.requestUpdate();
  }

  async addTag() {
    if (this.tag) {
      await post("/tags", { id: this.tag });
      this.setTag("");
    }
  }

  render() {
    const { tag } = this;
    return html`
      <uix-container horizontal gap="">
        <uix-input
          placeholder="Enter tag"
          autofocus
          .value=${tag}
          .input=${(e) => {
            this.tag = e.target.value;
          }}
          size="sm"
        ></uix-input>
        <uix-button .onclick=${() => this.addTag()}> Add Tag </uix-button>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-tag-form", AppTagForm);
