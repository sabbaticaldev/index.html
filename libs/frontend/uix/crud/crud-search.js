import { html, T } from "helpers";

export default {
  tag: "uix-crud-search",
  props: {
    setRows: T.function(),
    model: T.string(),
  },
  theme: {
    "uix-crud-search__form": "flex items-center flex-grow",
    "uix-crud-search__input-container": "relative w-full",
    "uix-crud-search__input-icon":
      "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
    "uix-crud-search__input":
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  },
  render() {
    return html`
      <form class="uix-crud-search__form">
        <label for="simple-search" class="sr-only">Search</label>
        <div class="uix-crud-search__input-container">
          <div class="uix-crud-search__input-icon">
            <uix-icon name="search"></uix-icon>
          </div>
          <input
            type="text"
            id="simple-search"
            class="uix-crud-search__input"
            placeholder="Search"
            required=""
          />
        </div>
      </form>
    `;
  },
};
