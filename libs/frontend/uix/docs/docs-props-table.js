import { html, T } from "helpers";

const DocsPropsTable = {
  props: {
    props: T.array(),
  },
  theme: {
    "uix-docs-props-table": "w-full",
    "uix-docs-props-table__header": "bg-gray-100 text-left",
    "uix-docs-props-table__cell": "border px-4 py-2",
  },
  render() {
    return html`
      <table class=${this.theme("uix-docs-props-table")}>
        <thead>
          <tr>
            <th
              class=${this.theme(
    "uix-docs-props-table__header",
    "uix-docs-props-table__cell",
  )}
            >
              Name
            </th>
            <th
              class=${this.theme(
    "uix-docs-props-table__header",
    "uix-docs-props-table__cell",
  )}
            >
              Type
            </th>
            <th
              class=${this.theme(
    "uix-docs-props-table__header",
    "uix-docs-props-table__cell",
  )}
            >
              Default
            </th>
            <th
              class=${this.theme(
    "uix-docs-props-table__header",
    "uix-docs-props-table__cell",
  )}
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          ${this.props.map(
    (prop) => html`
              <tr>
                <td class=${this.theme("uix-docs-props-table__cell")}>
                  ${prop.name}
                </td>
                <td class=${this.theme("uix-docs-props-table__cell")}>
                  ${prop.type}
                </td>
                <td class=${this.theme("uix-docs-props-table__cell")}>
                  ${prop.defaultValue}
                </td>
                <td class=${this.theme("uix-docs-props-table__cell")}>
                  ${prop.description}
                </td>
              </tr>
            `,
  )}
        </tbody>
      </table>
    `;
  },
};

export default DocsPropsTable;
