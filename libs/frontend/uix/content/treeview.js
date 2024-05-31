import { html, T } from "helpers";

const TreeView = {
  tag: "uix-treeview",
  props: {
    items: T.array({
      defaultValue: [],
      type: {
        label: T.string(),
        children: T.array(),
      },
    }),
  },
  theme: {
    "uix-treeview__list": "ml-4",
    "uix-treeview__item":
      "flex items-center mb-1 text-sm font-medium text-gray-900",
    "uix-treeview__item-icon": "w-4 h-4 mr-2",
    "uix-treeview__item-label": "cursor-pointer",
  },
  render() {
    const renderTreeItem = (item) => html`
      <li class=${this.theme("uix-treeview__item")}>
        <svg
          class=${this.theme("uix-treeview__item-icon")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class=${this.theme("uix-treeview__item-label")}>
          ${item.label}
        </span>
        ${item.children &&
        html`
          <ul class=${this.theme("uix-treeview__list")}>
            ${item.children.map(renderTreeItem)}
          </ul>
        `}
      </li>
    `;

    return html`
      <ul class=${this.theme("uix-treeview__list")}>
        ${this.items.map(renderTreeItem)}
      </ul>
    `;
  },
};

export default TreeView;
