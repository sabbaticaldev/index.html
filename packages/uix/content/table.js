import "../navigation/pagination.js";
import "./table-row.js";

import { html, ReactiveView, T } from "frontend";

class Table extends ReactiveView {
  static get properties() {
    return {
      currentPage: T.number({ defaultValue: 1 }),
      count: T.number(),
      perPage: T.number({ defaultValue: 10 }),
    };
  }

  firstUpdated() {
    this.updatePagination();
  }

  updated(changedProps) {
    if (changedProps.has("currentPage") || changedProps.has("perPage")) {
      this.updatePagination();
    }
  }

  updatePagination() {
    const rows = this.qaSlot();
    const totalResults = this.count || rows.length;
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;

    rows.forEach((row, index) => {
      row.style.display =
        index >= startIndex && index < endIndex ? "table-row" : "none";
    });

    this.count = totalResults;
    this.requestUpdate();
  }

  setCurrentPage(page) {
    this.currentPage = page;
    this.updatePagination();
  }

  static theme = {
    "": "w-full table",
    ".uix-table__container":
      "w-full text-sm text-left text-gray-500 dark:text-gray-400 table",
    ".uix-table__header-group":
      "bg-gray-50 dark:bg-gray-700 table-header-group",
    "[&_>uix-text]": "p-3 text-xs text-gray-700 uppercase table-cell",
    "[&_uix-table-row]": "table-row",
    "[&_>uix-table-row>*]": "table-cell",
    ".uix-table__row-group": "divide-gray-200 table-row-group",
  };

  render() {
    return html`
      <div class="uix-table__container" role="table">
        <div class="uix-table__header-group" role="rowgroup">
          <uix-table-row>
            <slot role="columnheader" name="header"></slot>
          </uix-table-row>
        </div>
        <div class="uix-table__row-group" role="rowgroup">
          <slot></slot>
        </div>
      </div>
      <uix-pagination
        count=${this.count || 0}
        currentPage=${this.currentPage}
        perPage=${this.perPage}
        .onPageChange=${this.setCurrentPage.bind(this)}
      ></uix-pagination>
    `;
  }
}

export default ReactiveView.define("uix-table", Table);
