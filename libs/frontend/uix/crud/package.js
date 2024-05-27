import Crud from "./crud.js";
import CrudActions from "./crud-actions.js";
import CrudDetail from "./crud-detail.js";
import CrudForm from "./crud-form.js";
import CrudNewModal from "./crud-new-modal.js";
import CrudSearch from "./crud-search.js";
import CrudTable from "./crud-table.js";
import ImportCsvButton from "./import-csv-button.js";

export default {
  i18n: {},
  views: {
    "uix-crud": Crud,
    "uix-crud-search": CrudSearch,
    "uix-crud-actions": CrudActions,
    "uix-crud-table": CrudTable,
    "uix-crud-detail": CrudDetail,
    "uix-crud-form": CrudForm,
    "uix-crud-new-modal": CrudNewModal,
    "app-import-csv-button": ImportCsvButton,
  },
};
