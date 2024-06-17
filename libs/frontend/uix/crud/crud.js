import { html, T } from "helpers";

export default {
  tag: "uix-crud",
  props: {
    model: T.string(),
    rows: T.array(),
    fields: T.array(),
    setRows: T.function(),
    ModelClass: T.object(),
  },
  theme: {
    "uix-crud": "flex flex-col gap-4",
    "uix-crud__actions": "flex justify-between items-center",
    "uix-crud__table": "w-full",
  },
  render() {
    return html`
      <div class="uix-crud__actions">
        <uix-crud-search
          .model=${this.model}
          .setRows=${this.setRows}
        ></uix-crud-search>
        <uix-crud-actions
          .model=${this.model}
          .rows=${this.rows}
          .setRows=${this.setRows}
          .fields=${this.fields}
          .ModelClass=${this.ModelClass}
        ></uix-crud-actions>
      </div>
      <div class="uix-crud__table">
        <uix-crud-table
          .rows=${this.rows}
          .fields=${this.fields}
        ></uix-crud-table>
      </div>
    `;
  },
};
