import { html, T } from "helpers";

const CrudTable = {
  tag: "uix-crud-table",
  props: {
    rows: T.array(),
    fields: T.object(),
  },
  theme: {
    "uix-crud-table": "w-full",
  },
  render() {
    return html`
      <uix-table .headers=${this.fields} .rows=${this.rows}></uix-table>
    `;
  },
};

export default CrudTable;
