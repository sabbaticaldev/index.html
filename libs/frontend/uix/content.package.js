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
    const baseClass = this.theme("uix-card");
    return html`<uix-block containerClass=${baseClass} spacing=${this.spacing}><slot></slot></uix-block>`;
  },
};

const Table = {
  props: tableProps,
  paginatedRows,
  render() {
    const headerElements = this.headers.map((header) => html`<th scope="col" class=${this.theme("uix-table__header")}>${header}</th>`);
    const rowElements = this.paginatedRows().map((row) =>
      html`<tr>${Array.isArray(row) ? row : Object.values(row).map((cell) => html`<td class=${this.theme("uix-table__cell")}>${cell}</td>`)}</tr>`
    );

    return html`
      <div>
        <table class=${this.theme("uix-table")}>
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
      <div class=${this.theme("uix-mockup-phone")}>
        <div class=${this.theme("uix-mockup-phone__top")}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 0 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 1 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "left", index: 2 })}></div>
        <div class=${this.theme("uix-mockup-phone__side", { position: "right", index: 1 })}></div>
        <div class=${this.theme("uix-mockup-phone__content")}><slot></slot></div>
      </div>
    `;
  },
};


const theme = (userTheme, props) => ({
  "uix-card": { _base: "shadow", spacing: props.SpacingSizes, variant: props.BaseVariants },
  "uix-block": { spacing: props.SpacingSizes, variant: props.BaseVariants },
  "uix-list": {
    _base: "flex", spacing: props.SpacingSizes, gap: props.Gaps, justify: props.JustifyContent,
    full: ({ vertical }) => ({ true: vertical ? "w-full" : "h-full" }),
    vertical: { true: "flex-col" },
    responsive: ({ vertical }) => ({ true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row" }),
    reverse: ({ vertical }) => ({ true: vertical ? "flex-col-reverse" : "flex-row-reverse" })
  },
  "uix-divider": "flex items-center my-2",
  "uix-divider__border": "border-t border-gray-400 flex-grow",
  "uix-divider__label": "px-3 text-gray-800 font-bold text-2xl",
  "uix-mockup-phone": "relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[700px] w-[400px] shadow-xl",
  "uix-mockup-phone__top": "w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute",
  "uix-mockup-phone__side": ({ position = "left", index = 0 }) => ({
    _base: `h-[${index === 0 ? 32 : index === 1 ? 46 : 64}px] w-[3px] bg-gray-800 absolute -${position}-[17px] top-[${index === 0 ? 72 : index === 1 ? 124 : 142}px] rounded-${position === "left" ? "l" : "r"}-lg`
  }),
  "uix-mockup-phone__content": "rounded-xl overflow-hidden w-[372px] h-[672px] bg-white",
  "uix-table": "w-full text-sm text-left text-gray-500 dark:text-gray-400",
  "uix-table__header": "p-3 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
  "uix-table__cell": "px-3 py-2 text-xs",
});

export default {
  theme,
  views: {
    "uix-card": Card,
    "uix-table": Table,
    "uix-mockup-phone": MockupPhone,
  },
};
