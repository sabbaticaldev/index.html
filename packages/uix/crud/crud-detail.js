import { html, T } from "frontend";

export default {
  tag: "uix-crud-detail",
  props: {
    item: T.object(),
    fields: T.array(),
    editItem: T.function(),
    deleteItem: T.function(),
  },
  theme: {
    "uix-crud-detail": "p-4",
    "uix-crud-detail__actions": "mt-4",
  },
  render() {
    return html`
      ${this.fields.map(
        (field) => html`
          <div>
            <strong>${field}: </strong>
            <span>${this.item[field]}</span>
          </div>
        `,
      )}
      <div class="uix-crud-detail__actions">
        <uix-button @click=${() => this.editItem(this.item)}> Edit </uix-button>
        <uix-button variant="error" @click=${() => this.deleteItem(this.item)}>
          Delete
        </uix-button>
      </div>
    `;
  },
};
