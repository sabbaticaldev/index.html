import { get, html, ReactiveView, repeat, T } from "frontend";

class AppGroupBoard extends ReactiveView {
  static get properties() {
    return {
      currentPage: T.number({ defaultValue: 1 }),
      resultsPerPage: T.number({ defaultValue: 1 }),
      totalResults: T.number(),
      groups: T.array(),
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const groupsList = await get("groups");
    this.groups = groupsList;
    this.totalResults = groupsList.length;
    this.requestUpdate();
  }

  paginatedGroups() {
    if (this.groups) {
      const startIndex = (this.currentPage - 1) * this.resultsPerPage;
      const endIndex = startIndex + this.resultsPerPage;
      return this.groups.slice(startIndex, endIndex);
    }
    return [];
  }

  setCurrentPage(newPage) {
    this.currentPage = newPage;
    this.requestUpdate();
  }

  render() {
    const paginatedGroupsList = this.paginatedGroups();
    return html`
      <uix-container>
        <h2 class="text-xl font-bold text-center">groups</h2>
        ${repeat(
          paginatedGroupsList,
          (group) => group.id,
          (group) => html`<group-item .group=${group}></group-item>`,
        )}
        <uix-pagination
          totalResults=${this.totalResults}
          currentPage=${this.currentPage}
          resultsPerPage=${this.resultsPerPage}
          @page-change=${(e) => this.setCurrentPage(e.detail.page)}
        ></uix-pagination>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-group-board", AppGroupBoard);
