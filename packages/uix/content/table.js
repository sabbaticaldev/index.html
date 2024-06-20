import "../navigation/pagination.js";

import { html, ReactiveView, T } from "frontend";

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
    "": "w-full",
    ".uix-table__container":
      "w-full text-sm text-left text-gray-500 dark:text-gray-400 table",
    ".uix-table__header-group":
      "bg-gray-50 dark:bg-gray-700 table-header-group",
    "[&_>*]": "p-3 text-xs text-gray-700 uppercase table-cell",
    ".uix-table__row-group":
      "divide-y divide-gray-200 dark:divide-gray-600 table-row-group",
    ".uix-table__row": "table-row",
    ".uix-table__cell": "px-3 py-2 text-xs table-cell",
  };

  setCurrentPage(page) {
    this.currentPage = page;
    this.requestUpdate();
  }

  render() {
    const rowElements = this.paginatedRows().map(
      (row) =>
        html`<div class="uix-table__row" role="row">
          ${(Array.isArray(row) ? row : Object.values(row)).map(
            (cell) =>
              html`<div class="uix-table__cell" role="cell">${cell}</div>`,
          )}
        </div>`,
    );

    return html`
      <div class="uix-table__container" role="table">
        <div class="uix-table__header-group" role="rowgroup">
          <div class="uix-table__row" role="row">
            <slot role="columnheader" name="header"></slot>
          </div>
        </div>
        <div class="uix-table__row-group" role="rowgroup">${rowElements}</div>
      </div>
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
