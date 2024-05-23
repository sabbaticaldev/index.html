import { CSV, File, html, post, T } from "helpers";

const Crud = {
  props: {
    model: T.string(),
    rows: T.array(),
    fields: T.array(),
    setRows: T.function(),
    ModelClass: T.object(),
  },
  render() {
    return html`
      <uix-list containerClass="justify-between" spacing="md">
        <uix-crud-search .model=${this.model} .setRows=${this.setRows}></uix-crud-search>
        <uix-crud-actions .model=${this.model} .rows=${this.rows} .setRows=${this.setRows} .fields=${this.fields} .ModelClass=${this.ModelClass}></uix-crud-actions>
      </uix-list>
      <uix-crud-table .rows=${this.rows} .fields=${this.fields}></uix-crud-table>
    `;
  },
};

const CrudSearch = {
  props: {
    setRows: T.function(),
    model: T.string(),
  },
  render() {
    return html`
      <form class=${this.theme("uix-crud-search__form")}>
        <label for="simple-search" class="sr-only">Search</label>
        <div class=${this.theme("uix-crud-search__input-container")}>
          <div class=${this.theme("uix-crud-search__input-icon")}>
            <uix-icon name="search"></uix-icon>
          </div>
          <input
            type="text"
            id="simple-search"
            class=${this.theme("uix-crud-search__input")}
            placeholder="Search"
            required=""
          />
        </div>
      </form>
    `;
  },
};

const CrudActions = {
  props: {
    setRows: T.function(),
    model: T.string(),
    fields: T.array(),
    ModelClass: T.object(),
    rows: T.array(),
  },
  render() {
    return html`
      <uix-list>
        <uix-crud-new-modal .addRow=${(newRow) => this.setRows([...this.rows, newRow])} model=${this.model} .fields=${this.fields}></uix-crud-new-modal>
        <uix-button dropdown="hide" class=${this.theme("uix-crud-actions__button")}>
          <uix-icon name="chevron-down"></uix-icon> Actions
          <ul slot="dropdown" class=${this.theme("uix-crud-actions__dropdown")}>
            <li>
              <app-import-csv-button .setRows=${this.setRows} .rows=${this.rows} model=${this.model} .fields=${this.fields}></app-import-csv-button>
            </li>
            <li>
              <uix-button size="xs" variant="secondary">Export as CSV</uix-button>
            </li>
          </ul>
        </uix-button>
        <uix-button>Filter <uix-icon name="chevron-down"></uix-icon></uix-button>
      </uix-list>
    `;
  },
};

const CrudTable = {
  props: {
    rows: T.array(),
    fields: T.object(),
  },
  render() {
    return html`<uix-table .headers=${this.fields} .rows=${this.rows}></uix-table>`;
  },
};

const CrudNewModal = {
  props: {
    fields: T.array(),
    addRow: T.function(),
    model: T.string(),
    icon: T.string(),
  },
  render() {
    const { addRow = () => {}, fields, icon, model } = this;
    return html`
      <uix-modal title="Create new">
        ${icon
    ? html`<uix-icon-button slot="button" icon=${icon} class=${this.theme("uix-crud-new-modal__icon")}></uix-icon-button>`
    : html`<uix-button slot="button" variant="primary" class=${this.theme("uix-crud-new-modal__button")}>+ new</uix-button>`}
        <uix-form
          title="New"
          color="base"
          size="md"
          name="uixCRUDForm"
          .fields=${fields.map((field) => ({
    ...field,
    name: field,
    placeholder: field,
  }))}
          .actions=${[
    {
      label: "Create " + model,
      type: "submit",
      click: () => {
        const form = this.q("uix-form");
        const data = form.formData();
        if (form.validate()) {
          post(model, data).then(addRow);
          form.reset();
          this.q("uix-modal").hide();
        }
      },
    },
  ]}
        ></uix-form>
      </uix-modal>
    `;
  },
};

const ImportCsvButton = {
  props: {
    fields: T.array(),
    rows: T.array(),
    setRows: T.function(),
    model: T.string(),
    CSVRows: T.array(),
    CSVFields: T.array(),
  },
  handleFileChange: async function (e) {
    try {
      const file = e.target.files[0];
      const csvContent = await File.readFile(file);
      let data = CSV.parseCSV(csvContent);
      this.setCSVRows(data);
      this.setCSVFields(CSV.getFields(data));
      this.q("uix-modal").show();
    } catch (error) {
      console.error("Error processing file:", error);
    }
  },
  render() {
    const { setRows, CSVRows, fields = [], CSVFields, model } = this;
    const form = this.q("uix-form");
    return html`
      <uix-button @click=${() => this.q("#ImportCSVFileInput").click()} size="xs" variant="secondary">
        Import CSV
      </uix-button>
      <uix-modal>
        <input
          type="file"
          id="ImportCSVFileInput"
          accept=".csv"
          style="display: none;"
          @change=${this.handleFileChange}
        />
        <uix-list vertical>
          <uix-text size="lg" weight="bold">Select the matching CSV fields:</uix-text>
          ${html`<uix-form
            title="New"
            color="base"
            size="md"
            name="uixCRUDForm"
            .fields=${fields.map((field) => ({
    ...field,
    name: field,
    type: "select",
    options: ["choose a field for " + field, ...CSVFields],
    placeholder: field,
  }))}
            .actions=${[
    {
      label: "Import " + this.model,
      type: "submit",
      click: () => {
        const fieldMapping = form.formData();
        const rows = CSV.transformCsvData(CSVRows, fieldMapping);
        if (form.validate()) {
          post(model, rows).then((newPosts) => {
            setRows([...rows, newPosts]);
          });
          form.reset();
          this.q("uix-modal").hide();
        }
      },
    },
  ]}
          ></uix-form>`}
        </uix-list>
      </uix-modal>
    `;
  },
};
const theme = () => ({
  "uix-crud-search-form": "flex items-center flex-grow",
  "uix-crud-search-input__container": "relative w-full",
  "uix-crud-search-input__icon": "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
  "uix-crud-search-input": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  "uix-crud-actions__button": "text-left",
  "uix-crud-actions__dropdown": "flex flex-col",
  "uix-crud-new-modal__icon": "",
  "uix-crud-new-modal__button": "text-left"
});

export default {
  i18n: {},
  theme,
  views: {
    "uix-crud": Crud,
    "uix-crud-search": CrudSearch,
    "uix-crud-actions": CrudActions,
    "uix-crud-table": CrudTable,
    "uix-crud-new-modal": CrudNewModal,
    "app-import-csv-button": ImportCsvButton,
  },
};
