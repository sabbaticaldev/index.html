import { html, T } from "helpers";

const CrudTable = {
  props: {
    rows: T.array(),
    fields: T.object(),
  },
  theme: {
    "uix-crud-table": "w-full",
  },
  render() {
    return html`
      <div class=${this.theme("uix-crud-table")}>
        <uix-table .headers=${this.fields} .rows=${this.rows}></uix-table>
      </div>
    `;
  },
};

export default CrudTable;
