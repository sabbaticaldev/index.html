import { html, T } from "helpers";

export default {
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
