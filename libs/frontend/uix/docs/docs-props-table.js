import { html, T } from "helpers";

const DocsPropsTable = {
  tag: "uix-docs-props-table",
  props: {
    props: T.array(),
  },
  theme: {
    "uix-docs-props-table__element": "w-full",
    "uix-docs-props-table__header": "bg-gray-100 text-left",
    "uix-docs-props-table__cell": "border px-4 py-2",
  },
  render() {
    return html`
      <table data-theme="uix-docs-props-table__element">
        <thead>
          <tr>
            <th data-theme="uix-docs-props-table__header">Name</th>
            <th data-theme="uix-docs-props-table__header">Type</th>
            <th data-theme="uix-docs-props-table__header">Default</th>
            <th data-theme="uix-docs-props-table__header">Description</th>
          </tr>
        </thead>
        <tbody>
          ${this.props.map(
            (prop) => html`
              <tr>
                <td data-theme="uix-docs-props-table__cell">${prop.name}</td>
                <td data-theme="uix-docs-props-table__cell">${prop.type}</td>
                <td data-theme="uix-docs-props-table__cell">
                  ${prop.defaultValue}
                </td>
                <td data-theme="uix-docs-props-table__cell">
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
