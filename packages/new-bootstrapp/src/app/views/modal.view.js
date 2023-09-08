export default {
  tag: "app-modal",
  props: {
    closeFn: { type: Object },
  },
  render: ({ html, closeFn: teste }) => {
    const closeFn = () => !console.log({ teste }) && teste();
    return html`
      <div
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden text-left  transition-all sm:my-8 sm:w-full sm:p-6
              bg-gray-100 rounded-lg shadow-lg flex-col w-5/6 sm:max-w-2xl p-6"
            >
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  @click=${closeFn}
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="sm:flex sm:items-start w-full">
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
