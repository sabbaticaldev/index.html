import { html, T } from "frontend";

export default {
  tag: "uix-crud-form",
  props: {
    item: T.object(),
    fields: T.array(),
    saveItem: T.function(),
    cancelEdit: T.function(),
  },
  render() {
    return html`
      <uix-form
        .fields=${this.fields.map((field) => ({
          name: field,
          value: this.item[field],
        }))}
        .actions=${[
          {
            label: "Save",
            type: "submit",
            variant: "primary",
            click: () => this.saveItem(this.item),
          },
          {
            label: "Cancel",
            type: "button",
            click: this.cancelEdit,
          },
        ]}
      ></uix-form>
    `;
  },
};
