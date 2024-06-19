import { get, html, ReactiveView, repeat, until } from "frontend";

class AppCommunityBoard extends ReactiveView {
  async connectedCallback() {
    super.connectedCallback();
    this.communitiesList = get("communities");
    this.requestUpdate();
  }

  displayCommunities(communities) {
    return html`
      ${repeat(
        communities,
        (community) => community.id,
        (community) =>
          html`<community-item .community=${community}></community-item>`,
      )}
    `;
  }

  render() {
    return html`
      <uix-container secondary variant="secondary">
        <uix-text weight="bold">communities</uix-text>
        ${until(
          this.communitiesList.then(
            (res) =>
              html`<uix-container
                >${this.displayCommunities(res)}</uix-container
              >`,
            "Loading...",
          ),
        )}
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-community-board", AppCommunityBoard);
