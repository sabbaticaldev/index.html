export default {
  tag: "project-task",
  props: {
    task: {
      type: Object,
      defaultValue: {},
    },
  },
  controller: "task",
  render: ({ html, task = {}, controller }) => {
    const remove = () => controller.remove(task.id);
    const toggle = () => controller.toggletask(task.id);

    /*                 
    <!-- <li
    class="flex items-center justify-between p-2 hover:bg-gray-200 ${task.completed
      ? "line-through text-gray-400"
      : ""}"
  >
    <div class="view flex items-center space-x-2">
      <input
        class="toggle rounded focus:ring-2 focus:ring-blue-400"
        type="checkbox"
        .checked=${task.completed}
        @click=${toggle}
      />
      <label class="flex-grow">${task.title}</label>
      <button
        class="destroy text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        @click=${remove}
      >
        X
      </button>
    </div>
  </li> --> */
    return html`<div class="flex flex-col mx-2 p-1">
      <div
        class="flex flex-none flex-col p-2 mt-4 mb-4 rounded-larg overflow-hidden w-64 bg-gray-100"
      >
        <div class="flex items-center">
          <span class="rounded-full w-2 h-2 bg-yellow-500 bg-teal-400"></span
          ><span class="ml-2 text-sm">${task.priority}</span>
        </div>
        <div class="mt-2">
          <p class="text-sm">${task.task}</p>
          <div class="h-1 relative max-w-xl rounded-full overflow-hidden mt-4">
            <div class="w-full h-full bg-gray-200 absolute"></div>
            <div class="h-full rounded-full absolute w-1/2 bg-teal-400"></div>
          </div>
        </div>
        <div class="flex mt-3 justify-between">
          <div class="flex ml-3">
            <img
              class="-ml-3 inline-block h-8 w-8 rounded-full text-white shadow-solid"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80"
              alt="profile"
            /><img
              class="-ml-3 inline-block h-8 w-8 rounded-full text-white shadow-solid"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
              alt="profile"
            /><img
              class="-ml-3 inline-block h-8 w-8 rounded-full text-white shadow-solid"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
              alt="profile"
            />
          </div>
          <span class="flex text-gray-800 items-center"
            ><svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              class="w-6 h-6"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 10 12 10zM18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S19.1 10 18 10zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S7.1 10 6 10z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </div>`;
  },
};
