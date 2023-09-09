import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-list-box";

export default {
  tag: "todo-item",
  props: {
    todo: {
      type: Object,
      defaultValue: {},
    },
  },
  controller: "todo",
  render: ({ html, todo = {}, controller }) => {
    const remove = () => controller.remove(todo.id);
    const toggle = () => controller.toggleTodo(todo.id, !todo.completed);
    return html`
      <li
        class="flex items-center justify-between p-2 hover:bg-gray-200 ${todo.completed
          ? "line-through text-gray-400"
          : ""}"
      >
        <vaadin-checkbox
          class="toggle rounded focus:ring-2 focus:ring-blue-400"
          .checked=${todo.completed}
          @change=${toggle}
        >
          ${todo.title}
        </vaadin-checkbox>
        <vaadin-button
          class="destroy text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
          @click=${remove}
        >
          X
        </vaadin-button>
      </li>
    `;
  },
};
