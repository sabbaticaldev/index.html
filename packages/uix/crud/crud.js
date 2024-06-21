import "../content/table.js";
import "./crud-search.js";
import "./crud-actions.js";

import { get, html, patch, post, ReactiveView, remove, T } from "frontend";

class CRUD extends ReactiveView {
  static get properties() {
    return {
      model: T.string(),
      rows: T.array({ defaultValue: [] }),
      fields: T.array({ defaultValue: [] }),
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchModelInfo();
    await this.fetchRows();
  }

  async fetchModelInfo() {
    try {
      this.fields = window.models[this.model];
      console.log(window.models);
    } catch (error) {
      console.error("Error fetching model info:", error);
    }
  }

  async fetchRows() {
    try {
      this.rows = await get(this.model);
    } catch (error) {
      console.error("Error fetching rows:", error);
    }
  }

  async addRow(data) {
    try {
      const newRow = await post(this.model, data);
      this.rows = [...this.rows, newRow];
    } catch (error) {
      console.error("Error adding row:", error);
    }
  }

  async updateRow(id, data) {
    try {
      const updatedRow = await patch(`${this.model}/${id}`, data);
      this.rows = this.rows.map((row) => (row.id === id ? updatedRow : row));
    } catch (error) {
      console.error("Error updating row:", error);
    }
  }

  async deleteRow(id) {
    try {
      await remove(`${this.model}/${id}`);
      this.rows = this.rows.filter((row) => row.id !== id);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  }

  static theme = {
    "": "flex flex-col gap-4",
    ".uix-crud__actions": "flex justify-between items-center",
    ".uix-crud__table": "w-full",
  };

  render() {
    return html`
      <div class="uix-crud__actions">
        <uix-crud-search
          .model=${this.model}
          .setRows=${this.setRows.bind(this)}
        ></uix-crud-search>
        <uix-crud-actions
          .model=${this.model}
          .rows=${this.rows}
          .setRows=${this.setRows.bind(this)}
          .fields=${this.fields}
          .addRow=${this.addRow.bind(this)}
          .updateRow=${this.updateRow.bind(this)}
          .deleteRow=${this.deleteRow.bind(this)}
        ></uix-crud-actions>
      </div>
      <div class="uix-crud__table">
        <uix-table>
          ${this.fields.map(
            (field) => html`<uix-text slot="header">${field}</uix-text>`,
          )}
          ${this.rows.map(
            (row) => html`
              <uix-table-row>
                ${this.fields.map(
                  (field) => html`<uix-text>${row[field]}</uix-text>`,
                )}
              </uix-table-row>
            `,
          )}
        </uix-table>
      </div>
    `;
  }
}

export default ReactiveView.define("uix-crud", CRUD);
