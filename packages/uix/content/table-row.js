import "../navigation/pagination.js";

import { html, ReactiveView, T } from "frontend";

class TableRow extends ReactiveView {
  static get properties() {
    return {
      row: T.array(),
    };
  }

  static theme = {
    "": "table-row",
  };

  render() {
    return html`<slot></slot>`;
  }
}

export default ReactiveView.define("uix-table-row", TableRow);
