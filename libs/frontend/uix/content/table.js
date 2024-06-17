import "../navigation/pagination.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";

class Table extends ReactiveView {
  static get properties() {
    return {
      headers: T.array(),
      rows: T.array(),
      currentPage: T.number({ defaultValue: 1 }),
      resultsPerPage: T.number({ defaultValue: 10 }),
    };
  }

  paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
    return this.rows.slice(startIndex, startIndex + this.resultsPerPage);
  }

  static theme = {
    ".uix-table__table":
      "w-full text-sm text-left text-gray-500 dark:text-gray-400",
    ".uix-table__header":
      "p-3 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
    ".uix-table__cell": "px-3 py-2 text-xs",
  };

  setCurrentPage(page) {
    this.currentPage = page;
    this.requestUpdate();
  }

  render() {
    const headerElements = this.headers.map(
      (header) =>
        html`<th scope="col" class="uix-table__header">${header}</th>`,
    );
    const rowElements = this.paginatedRows().map(
      (row) =>
        html`<tr>
          ${Array.isArray(row)
            ? row
            : Object.values(row).map(
                (cell) => html`<td class="uix-table__cell">${cell}</td>`,
              )}
        </tr>`,
    );

    return html`
      <table class="uix-table__table">
        <thead>
          <tr>
            ${headerElements}
          </tr>
        </thead>
        <tbody>
          ${rowElements}
        </tbody>
      </table>
      <uix-pagination
        totalResults=${this.rows.length}
        currentPage=${this.currentPage}
        resultsPerPage=${this.resultsPerPage}
        .onPageChange=${this.setCurrentPage.bind(this)}
      ></uix-pagination>
    `;
  }
}

export default ReactiveView.define("uix-table", Table);
