export default {
  tag: "todo-app",
  props: {
    list: {
      type: Array,
      defaultValue: [],
      scope: "app",
    },
  },
  controller: "todo",
  render: ({ html, list, controller }) => {
    const todoList = Array.isArray(list)
      ? list.map((todo) => html`<todo-item .todo=${todo}></todo-item>`)
      : [];

    return html`
      <section
        class="todo-app bg-gray-100 p-4 rounded-md"
        style="width: 500px; margin: auto; padding: 50px;"
      >
        <header class="header mb-4">
          <h1 class="text-2xl font-bold mb-2">Todos</h1>
          <vaadin-text-field
            class="new-todo p-2 rounded-md w-full border focus:border-blue-400 focus:outline-none shadow-sm"
            placeholder="What needs to be done?"
            autofocus
            @keydown=${controller.addTodo}
          ></vaadin-text-field>
        </header>
        <section class="main">
          <vaadin-list-box class="todo-list divide-y divide-gray-300">
            ${todoList}
          </vaadin-list-box>
        </section>
        <footer class="footer mt-4"></footer>
      </section>
    `;
  },
};
