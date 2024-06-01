import { html, T } from "helpers";

const Pagination = {
  tag: "uix-pagination",
  props: {
    totalResults: T.number(),
    currentPage: T.number(),
    resultsPerPage: T.number({ defaultValue: 10 }),
    onPageChange: T.function(),
  },
  theme: {
    "uix-pagination__nav":
      "flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4",
    "uix-pagination__info":
      "text-sm font-normal text-gray-500 dark:text-gray-400",
    "uix-pagination__info-highlight":
      "font-semibold text-gray-900 dark:text-white",
    "uix-pagination__list": "inline-flex items-stretch -space-x-px",
    "uix-pagination__item": "p-2",
    "uix-pagination__link":
      "flex items-center justify-center p-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
    "uix-pagination__link-active":
      "flex items-center justify-center p-2 text-sm leading-tight text-blue-600 bg-blue-50 border border-blue-300",
  },
  renderPageLink(page, label) {
    const isActive = page === this.currentPage;
    return html`
      <li data-theme="uix-pagination__item">
        <a
          href="#"
          data-theme=${isActive
            ? "uix-pagination__link-active"
            : "uix-pagination__link"}
          @click=${() => this.onPageChange(page)}
        >
          ${label || page}
        </a>
      </li>
    `;
  },
  render() {
    const totalPageCount = Math.floor(this.totalResults / this.resultsPerPage);
    const startItem = (this.currentPage - 1) * this.resultsPerPage + 1;
    const endItem = Math.min(
      startItem + this.resultsPerPage - 1,
      this.totalResults,
    );
    const visiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(visiblePages / 2),
    );
    let endPage = Math.min(totalPageCount, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pageLinks = [];
    if (this.currentPage > 1) {
      pageLinks.push(this.renderPageLink(this.currentPage - 1, "Previous"));
    }
    if (startPage > 1) {
      pageLinks.push(this.renderPageLink(1));
      if (startPage > 2) {
        pageLinks.push(this.renderPageLink(startPage - 1, "..."));
      }
    }
    for (let page = startPage; page <= endPage; page++) {
      pageLinks.push(this.renderPageLink(page));
    }
    if (endPage < totalPageCount) {
      if (endPage < totalPageCount - 1) {
        pageLinks.push(this.renderPageLink(endPage + 1, "..."));
      }
      pageLinks.push(this.renderPageLink(totalPageCount));
    }
    if (this.currentPage < totalPageCount) {
      pageLinks.push(this.renderPageLink(this.currentPage + 1, "Next"));
    }

    return html`
      <nav data-theme="uix-pagination__nav" aria-label="Table navigation">
        <span data-theme="uix-pagination__info">
          Showing
          <span data-theme="uix-pagination__info-highlight"
            >${startItem}-${endItem}</span
          >
          of
          <span data-theme="uix-pagination-info-highlight"
            >${this.totalResults}</span
          >
        </span>
        <ul data-theme="uix-pagination__list">
          ${pageLinks}
        </ul>
      </nav>
    `;
  },
};

export default Pagination;
