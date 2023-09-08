export default {
  tag: "project-board",
  props: {
    board: {
      type: Array,
      defaultValue: [],
    },
    addingNewTask: {
      type: Boolean,
      defaultValue: false,
    },
  },
  controller: "task",
  render: (host) => {
    const { html, board, addingNewTask, setAddingNewTask, controller } = host;
    const { tasks } = board;
    const taskList =
      Array.isArray(tasks) &&
      tasks.map((task) => html`<project-task .task=${task}></project-task>`);
    const toggleNewTaskForm = () => {
      const toggle = !addingNewTask;
      setAddingNewTask(toggle);
      const input = host.shadowRoot.querySelector("input");

      if (toggle) {
        input.focus();
        input.classList.remove("hidden");
      } else {
        input.classList.add("hidden");
      }
    };

    const addtask = ({ target, key }) => {
      if (key === "Enter" && !!target.value) {
        if (controller.add({ title: target.value })) {
          target.value = "";
        }
      }
    };

    return html`<div class="flex mt-10 mx-4 flex-col w-full md:w-96">
      <div class="flex items-center">
        <h4 class="p-1 rounded-sm border-b-4 border-indigo-500">
          ${board.name}
        </h4>
        <span class="p-1 text-gray-500">(${board.tasks.length})</span>
      </div>
      <div class="p-2 overflow-y-auto tasks--scrollbar">${taskList}</div>
      <div class="flex items-center text-sm mt-2">
        <button>
          <svg
            class="w-3 h-3 mr-3 focus:outline-none"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
        <button @click=${toggleNewTaskForm}>Add a card...</button>
      </div>
      <input
        type="text"
        id="new-task-input"
        @keydown=${addtask}
        class="rounded-sm shadow-sm px-4 py-2 border-0 0 w-48 mt-4"
      />
    </div>`;
  },
};
