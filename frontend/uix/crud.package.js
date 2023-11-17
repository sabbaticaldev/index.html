import {
  createRef,
  html,
  ref,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";

import { post } from "../helpers/rest.js";
import { T } from "../helpers/types.js";

export default {
  i18n: {},
  views: {
    "uix-create-new-modal": {
      props: {
        fields: T.array(),
        rows: T.array(),
        setRows: T.function(),
        model: T.string(),
      },
      render: function () {
        const { setRows, rows, fields, model } = this;
        const formRef = createRef();
        return html`<uix-modal title="Create new">
          <uix-button slot="button" variant="primary"> + new </uix-button>
          <uix-form
            ${ref(formRef)}
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
        const data = formRef.value.formData();
        if (formRef.value.validate()) {
          post(model, data).then((newPost) => {
            setRows([...rows, newPost]);
          });
          formRef.value.reset();
          this.q("uix-modal").hide();
        }
      },
    },
  ]}
          ></uix-form>
        </uix-modal>`;
      },
    },
  },
};
