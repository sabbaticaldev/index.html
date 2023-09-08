interface Task {
  task: string;
  priority: string;
}

interface Board {
  name: string;
  tasks: Array<Task>;
}

export default {
  tag: 'app-projects',
  name: 'Projects',
  secondary: true,
  icon: 'people-fill',
  props: {
    boards: {
      defaultValue: [],
      type: Array,
      scope: 'app',
    },
    newTaskModal: {
      defaultValue: false,
      type: Boolean,
    },
  },
  render: ({ html, boards }) => html`
    <app-bootstrapp>
      <div class="flex flex-col">
        <div class="flex">
          <div class="flex flex-col flex-1 mt-5 mb-2  pl-4">
            <div class="flex flex-col">
              <h2
                class="w-full text-taskDo-backGray text-5xl font-semiBold leading-normal"
              >
                Launch Project
              </h2>
              <h6 class="w-full text-gray-500 text-2xl">
                Welcome to your task management desktop
              </h6>
            </div>
            <div class="flex mt-6 justify-between">
              <div class="flex">
                <div class="flex overflow-hidden">
                  <img
                    class="inline-block h-10 w-10 rounded-full text-white shadow-solid"
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                    alt="profile"
                  /><img
                    class="-ml-3 inline-block h-10 w-10 rounded-full text-white shadow-solid"
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                    alt="profile"
                  /><img
                    class="-ml-3 inline-block h-10 w-10 rounded-full text-white shadow-solid"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.25&amp;w=256&amp;h=256&amp;q=80"
                    alt="profile"
                  /><img
                    class="-ml-3 inline-block h-10 w-10 rounded-full text-white shadow-solid"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                    alt="profile"
                  />
                  <div
                    class="-ml-3 flex items-center justify-center content-center inline-block h-10 w-10 rounded-full text-center text-white shadow-solid bg-indigo-500"
                  >
                    <span>Me</span>
                  </div>
                </div>
                <button
                  href="#"
                  class="flex ml-10 mr-1 items-center justify-between p-1 bg-indigo-200 rounded-large"
                >
                  <span class="text-gray-800 text-base mx-3"> New Task </span>
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="0"
                    viewBox="0 0 24 24"
                    class="w-8 h-8 text-indigo-500 mx-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
              <div class="flex items-center space-x-6 mr-10">
                <div class="flex items-center">
                  <span class="rounded-full w-2 h-2 bg-indigo-500"></span
                  ><span class="ml-2 text-sm">High</span>
                </div>
                <div class="flex items-center">
                  <span class="rounded-full w-2 h-2 bg-yellow-500"></span
                  ><span class="ml-2 text-sm">Medium</span>
                </div>
                <div class="flex items-center">
                  <span class="rounded-full w-2 h-2 bg-teal-400"></span
                  ><span class="ml-2 text-sm">Less</span>
                </div>
                <div class="flex items-center">
                  <span class="rounded-full w-2 h-2 bg-pink-400"></span
                  ><span class="ml-2 text-sm">Default</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex mb-5">
          ${boards?.map(
            (board: Board) => html`<div class="flex mt-10 mx-4 flex-col">
              <div class="flex items-center">
                <h4 class="p-1 rounded-sm border-b-4 border-indigo-500">
                  ${board.name}
                </h4>
                <span class="p-1 text-gray-500">(${board.tasks.length})</span>
              </div>
              <div class="p-2 overflow-y-auto tasks--scrollbar">
                ${board.tasks.map(
                  (task) => html`<div class="flex flex-col mx-2 p-1">
                    <div
                      class="flex flex-none flex-col p-2 mt-4 mb-4 rounded-large bg-white overflow-hidden w-64"
                    >
                      <div class="flex items-center">
                        <span
                          class="rounded-full w-2 h-2 bg-yellow-500 bg-teal-400"
                        ></span
                        ><span class="ml-2 text-sm">${task.priority}</span>
                      </div>
                      <div class="mt-2">
                        <p class="text-sm">${task.task}</p>
                        <div
                          class="h-1 relative max-w-xl rounded-full overflow-hidden mt-4"
                        >
                          <div class="w-full h-full bg-gray-200 absolute"></div>
                          <div
                            class="h-full rounded-full absolute w-1/2 bg-teal-400"
                          ></div>
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
                  </div>`
                )}
              </div>
            </div>`
          )}
        </div>
      </div>
    </app-bootstrapp>
  `,
};

