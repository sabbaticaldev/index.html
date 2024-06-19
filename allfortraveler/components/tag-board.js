import { get, html, ReactiveView, T, until } from "frontend";

class AppTagsBoard extends ReactiveView {
  static properties = {
    tags: T.array({ defaultValue: [] }),
  };
  updated(changedProperties) {
    console.log({ changedProperties });
  }
  render() {
    const list = get("/tags");
    return html`
      <uix-container horizontal padding="md" gap="md">
        ${until(
          list.then(
            (res) => res.map((tag) => html`<uix-button>${tag.id}</uix-button>`),
            "loading",
          ),
        )}
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-tag-board", AppTagsBoard);
