/**
 * @typedef {Object} App
 * @property {string} name
 * @property {string} title
 * @property {string} icon
 * @property {boolean} [secondary]
 * @property {number} [index]
 * @property {number|null} [notifications]
 * @property {{ [key: string]: any }|null} [additionalProps]
 */

export default {
  tag: "app-topbar",
  props: {
    apps: {
      type: Array,
      scope: "app",
    },
  },
  render({ apps: appsProps, html }) {
    /**
     * @param {App} app
     * @returns {boolean}
     */
    const filterFunc = (app) => !app.secondary;

    /**
     * @param {App} a
     * @param {App} b
     * @returns {number}
     */
    const sortFunc = (a, b) => {
      if (a.index !== undefined && b.index === undefined) return -1;
      if (b.index !== undefined && a.index === undefined) return 1;
      if (a.index !== undefined && b.index !== undefined)
        return a.index - b.index;
      return 0;
    };

    const apps = appsProps?.filter(filterFunc).sort(sortFunc) || [];

    /**
     * @param {App} app
     * @returns {any} - TemplateResult
     */
    const mapFunc = (app) => html`
      <a
        href="/${app.name.toLowerCase()}"
        class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white  data-[active]:bg-gray-900 data-[active]:text-white"
        aria-current="page"
        ?data-active=${typeof window !== "undefined" &&
        window.location.pathname.includes(app.name.toLocaleLowerCase())}
        >${app.name}</a
      >
    `;

    const appMenu = apps.map(mapFunc);

    return html`
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center">
            <div class="flex items-center">
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  ${appMenu}
                </div>
              </div>
            </div>

            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button
                type="button"
                class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <!-- Menu open: "hidden", Menu closed: "block" -->
                <svg
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <svg
                  class="hidden h-6 w-6"
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
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="md:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">${appMenu}</div>
        </div>
      </nav>
    `;
  },
};
