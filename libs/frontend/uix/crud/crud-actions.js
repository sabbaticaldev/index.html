import { html, T } from "helpers";

const CrudActions = {
  tag: "uix-crud-actions",
  props: {
    setRows: T.function(),
    model: T.string(),
    fields: T.array(),
    ModelClass: T.object(),
    rows: T.array(),
  },
  theme: {
    "uix-crud-actions": "flex gap-2",
    "uix-crud-actions__button": "text-left",
    "uix-crud-actions__dropdown": "flex flex-col",
  },
  render() {
    return html`
      <div class=${this.theme("uix-crud-actions")}>
        <uix-crud-new-modal
          .addRow=${(newRow) => this.setRows([...this.rows, newRow])}
          model=${this.model}
          .fields=${this.fields}
        ></uix-crud-new-modal>
        <uix-button
          dropdown="hide"
          class=${this.theme("uix-crud-actions__button")}
        >
          <uix-icon name="chevron-down"></uix-icon> Actions
          <ul slot="dropdown" class=${this.theme("uix-crud-actions__dropdown")}>
            <li>
              <app-import-csv-button
                .setRows=${this.setRows}
                .rows=${this.rows}
                model=${this.model}
                .fields=${this.fields}
              ></app-import-csv-button>
            </li>
            <li>
              <uix-button size="xs" variant="secondary"
                >Export as CSV</uix-button
              >
            </li>
          </ul>
        </uix-button>
        <uix-button
          >Filter <uix-icon name="chevron-down"></uix-icon
        ></uix-button>
      </div>
    `;
  },
};

export default CrudActions;
