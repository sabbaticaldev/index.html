import { html, T } from "helpers";

const cardProps = {
  border: T.boolean({ defaultValue: true }),
  shadow: T.boolean({ defaultValue: true }),
  variant: T.string({ defaultValue: "primary" }),
  text: T.string(),
  rounded: T.boolean({ defaultValue: "none" }),
  spacing: T.string({ defaultValue: "md" }),
};

const tableProps = {
  headers: T.array(),
  rows: T.array(),
  currentPage: T.number({ defaultValue: 1 }),
  resultsPerPage: T.number({ defaultValue: 10 }),
};

const paginatedRows = function () {
  const startIndex = (this.currentPage - 1) * this.resultsPerPage;
  return this.rows.slice(startIndex, startIndex + this.resultsPerPage);
};

const Card = {
  props: cardProps,
  render() {
    const baseClass = this.generateTheme("uix-card");
    return html`<uix-block containerClass=${baseClass} spacing=${this.spacing}><slot></slot></uix-block>`;
  },
};

const Table = {
  props: tableProps,
  paginatedRows,
  render() {
    const headerElements = this.headers.map((header) => html`<th scope="col" class=${this.generateTheme("uix-table__header")}>${header}</th>`);
    const rowElements = this.paginatedRows().map((row) =>
      html`<tr>${Array.isArray(row) ? row : Object.values(row).map((cell) => html`<td class=${this.generateTheme("uix-table__cell")}>${cell}</td>`)}</tr>`
    );

    return html`
      <div>
        <table class=${this.generateTheme("uix-table")}>
          <thead>
            <tr>${headerElements}</tr>
          </thead>
          <tbody>${rowElements}</tbody>
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
};

const MockupPhone = {
  props: {
    prefix: T.string(),
    code: T.string(),
    highlight: T.boolean(),
    variant: T.string(),
  },
  render() {
    return html`
      <div class=${this.generateTheme("uix-mockup-phone")}>
        <div class=${this.generateTheme("uix-mockup-phone__top")}></div>
        <div class=${this.generateTheme("uix-mockup-phone__side", { position: "left", index: 0 })}></div>
        <div class=${this.generateTheme("uix-mockup-phone__side", { position: "left", index: 1 })}></div>
        <div class=${this.generateTheme("uix-mockup-phone__side", { position: "left", index: 2 })}></div>
        <div class=${this.generateTheme("uix-mockup-phone__side", { position: "right", index: 1 })}></div>
        <div class=${this.generateTheme("uix-mockup-phone__content")}><slot></slot></div>
      </div>
    `;
  },
};

export default {
  views: {
    "uix-card": Card,
    "uix-table": Table,
    "uix-mockup-phone": MockupPhone,
  },
};
