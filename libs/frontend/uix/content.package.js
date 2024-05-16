import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

export default {
  views: {
    "uix-card": {
      props: {
        border: T.boolean({ defaultValue: true }),
        shadow: T.boolean({ defaultValue: true }),
        variant: T.string({ defaultValue: "primary" }),
        text: T.string(),
        rounded: T.boolean({ defaultValue: "none" }),
        spacing: T.string({ defaultValue: "md" }),
      },
      render: function () {
        const baseClass = this.generateTheme("uix-card");
        return html`<uix-block containerClass=${baseClass} spacing=${this.spacing}>
          <slot></slot>
        </uix-block>`;
      },
    },
    "uix-table": {
      props: {
        headers: T.array(),
        rows: T.array(), // All rows, not just those for the current page
        currentPage: T.number({ defaultValue: 1 }),
        resultsPerPage: T.number({ defaultValue: 10 }),
      },
      paginatedRows() {
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        return this.rows.slice(startIndex, startIndex + this.resultsPerPage);
      },
      render: function () {
        const headerElements = this.headers.map(
          (header) => html`<th scope="col" class="p-3">${header}</th>`,
        );
        const rowElements = this.paginatedRows()
          .filter(Boolean)
          .map((row) => {
            const cells = Array.isArray(row) ? row : Object.values(row);
            return html`<tr>
              ${cells.map(
    (cell) => html`<td class="px-3 py-2 text-xs">${cell}</td>`,
  )}
            </tr>`;
          });

        return html`
          <div>
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
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
              .onPageChange=${this.setCurrentPage}
            ></uix-pagination>
          </div>
        `;
      },
    },

    "uix-mockup-phone": {
      props: {
        prefix: T.string(),
        code: T.string(),
        highlight: T.boolean(),
        variant: T.string(),
      },
      render: function () {
        return html`
          <div
            class="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[700px] w-[400px] shadow-xl"
          >
            <div
              class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"
            ></div>
            <div
              class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"
            ></div>
            <div
              class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"
            ></div>
            <div
              class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"
            ></div>
            <div
              class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"
            ></div>
            <div
              class="rounded-xl overflow-hidden w-[372px] h-[672px] bg-white"
            >
              <slot></slot>
            </div>
          </div>
        `;
      },
    },
  },
};
