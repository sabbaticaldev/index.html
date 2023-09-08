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
        <div class="view flex items-center space-x-2">
          <input
            class="toggle rounded focus:ring-2 focus:ring-blue-400"
            type="checkbox"
            .checked=${todo.completed}
            @click=${toggle}
          />
          <label class="flex-grow">${todo.title}</label>
          <button
            class="destroy text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            @click=${remove}
          >
            X
          </button>
        </div>
      </li>
    `;
  },
};
