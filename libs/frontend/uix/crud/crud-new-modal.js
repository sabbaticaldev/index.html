import { html, post, T } from "helpers";

const CrudNewModal = {
  tag: "uix-crud-new-modal",
  props: {
    fields: T.array(),
    addRow: T.function(),
    model: T.string(),
    icon: T.string(),
  },
  theme: {
    "uix-crud-new-modal__icon": "",
    "uix-crud-new-modal__button": "text-left",
  },
  render() {
    const { addRow = () => {}, fields, icon, model } = this;
    return html`
      <uix-modal title="Create new">
        ${icon
          ? html`<uix-icon-button
              slot="button"
              icon=${icon}
              data-theme="uix-crud-new-modal__icon"
            ></uix-icon-button>`
          : html`<uix-button
              slot="button"
              variant="primary"
              data-theme="uix-crud-new-modal__button"
              >+ new</uix-button
            >`}
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

export default CrudNewModal;
