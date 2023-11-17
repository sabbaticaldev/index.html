import {
  createRef,
  html,
  ref,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3.0.0/all/lit-all.min.js";

import * as CSV from "../helpers/csv.js";
import { post } from "../helpers/rest.js";
import { T } from "../helpers/types.js";
export default {
  i18n: {},
  views: {
    "uix-crud-new-modal": {
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

    "app-import-csv-button": {
      props: {
        fields: T.array(),
        rows: T.array(),
        setRows: T.function(),
        model: T.string(),
        CSVRows: T.array(),
        CSVFields: T.array(),
      },
      handleFileChange: async function (e) {
        try {
          const file = e.target.files[0];
          const csvContent = await File.readFile(file);
          let data = CSV.parseCSV(csvContent);
          this.setCSVRows(data);
          this.setCSVFields(CSV.getFields(data));
          this.q("uix-modal").show();
        } catch (error) {
          console.error("Error processing file:", error);
        }
      },
      render: function () {
        const { setRows, CSVRows, fields = [], CSVFields, model } = this;
        const form = this.q("uix-form");
        return html` <uix-button
            @click=${() => this.q("#ImportCSVFileInput").click()}
            size="xs"
            variant="secondary"
          >
            Import CSV
          </uix-button>
          <uix-modal>
            <input
              type="file"
              id="ImportCSVFileInput"
              accept=".csv"
              style="display: none;"
              @change=${this.handleFileChange}
            />
            <uix-list vertical>
              <uix-text size="lg" weight="bold">
                Select the matching CSV fields:
              </uix-text>
              ${html`<uix-form
                title="New"
                color="base"
                size="md"
                name="uixCRUDForm"
                .fields=${fields.map((field) => ({
    ...field,
    name: field,
    type: "select",
    options: ["choose a field for " + field, ...CSVFields],
    placeholder: field,
  }))}
                .actions=${[
    {
      label: "Import " + this.model,
      type: "submit",
      click: () => {
        const fieldMapping = form.formData();
        const rows = CSV.transformCsvData(CSVRows, fieldMapping);
        if (form.validate()) {
          post(model, rows).then((newPosts) => {
            setRows([...rows, newPosts]);
          });
          form.reset();
          this.q("uix-modal").hide();
        }
      },
    },
  ]}
              >
              </uix-form>`}
            </uix-list>
          </uix-modal>`;
      },
    },
  },
};
