import "../layout/container.js";

import { ReactiveView } from "frontend";
import { defaultTheme, genTheme, html, T } from "helpers";

const PaginationVariants = {
  default: "bg-white",
  primary: `bg-${defaultTheme.colors.primary}-100`,
  secondary: `bg-${defaultTheme.colors.secondary}-100`,
};

class Pagination extends ReactiveView {
  static get properties() {
    return {
      totalResults: T.number(),
      currentPage: T.number(),
      resultsPerPage: T.number({ defaultValue: 10 }),
      onPageChange: T.function(),
      variant: T.string({ defaultValue: "default" }),
      size: T.string({ defaultValue: "md" }),
    };
  }

  static theme = {
    ".uix-pagination__nav": `space-y-3 md:space-y-0 p-4 ${genTheme(
      "variant",
      Object.keys(PaginationVariants),
      (entry) => PaginationVariants[entry],
      { string: true },
    )}`,
    ".uix-pagination__info":
      "text-sm font-normal text-gray-500 dark:text-gray-400",
    ".uix-pagination__info-highlight":
      "font-semibold text-gray-900 dark:text-white",
    ".uix-pagination__list": "inline-flex items-center space-x-1",
    ".uix-pagination__item": "px-3 py-1 rounded-md",
    ".uix-pagination__link":
      "flex items-center justify-center text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    ".uix-pagination__link--active":
      "flex items-center justify-center p-2 text-sm leading-tight text-blue-600 bg-blue-50 border border-blue-300",
  };

  renderPageLink(page, label) {
    const isActive = page === this.currentPage;
    return html`
      <li class="uix-pagination__item">
        <a
          href="#"
          class=${`uix-pagination__link ${
            isActive ? "uix-pagination__link--active" : ""
          }`}
          @click=${() => this.onPageChange(page)}
        >
          ${label || page}
        </a>
      </li>
    `;
  }

  render() {
    const totalPageCount = Math.ceil(this.totalResults / this.resultsPerPage);
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
      <uix-container
        items="center"
        justify="between"
        horizontal
        role="navigation"
        class="uix-pagination__nav"
        aria-label="Table navigation"
      >
        <uix-container horizontal class="uix-pagination__info">
          Showing
          <span class="uix-pagination__info-highlight"
            >${startItem}-${endItem}</span
          >
          of
          <span class="uix-pagination__info-highlight"
            >${this.totalResults}</span
          >
        </uix-container>

        <ul class="uix-pagination__list">
          ${pageLinks}
        </ul>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-pagination", Pagination);
