import { html, T } from "helpers";

export default {
  tag: "uix-docs-props-table",
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
      <table class="uix-docs-props-table">
        <thead>
          <tr>
            <th class="uix-docs-props-table__header">Name</th>
            <th class="uix-docs-props-table__header">Type</th>
            <th class="uix-docs-props-table__header">Default</th>
            <th class="uix-docs-props-table__header">Description</th>
          </tr>
        </thead>
        <tbody>
          ${this.props.map(
            (prop) => html`
              <tr>
                <td class="uix-docs-props-table__cell">${prop.name}</td>
                <td class="uix-docs-props-table__cell">${prop.type}</td>
                <td class="uix-docs-props-table__cell">
                  ${prop.defaultValue}
                </td>
                <td class="uix-docs-props-table__cell">
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
