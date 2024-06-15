import { html, T, genTheme, defaultTheme, sizeMap } from "helpers";
import FormControls from "./form-controls.js";

const SearchVariants = {
  default: `${defaultTheme.defaultTextColor}`,
  primary: `border-${defaultTheme.colors.primary}-300 bg-${defaultTheme.colors.primary}-100 text-${defaultTheme.colors.primary}`,
  secondary: `border-${defaultTheme.colors.secondary}-300 bg-${defaultTheme.colors.secondary}-100 text-${defaultTheme.colors.secondary}`,
  success: `border-${defaultTheme.colors.success}-300 bg-${defaultTheme.colors.success}-100 text-${defaultTheme.colors.success}`,
  danger: `border-${defaultTheme.colors.error}-300 bg-${defaultTheme.colors.error}-100 text-${defaultTheme.colors.error}`,
};

const SearchSizes = ["xs", "sm", "md", "lg", "xl"];

const Search = {
  tag: "uix-search",
  ...FormControls("search"),
  props: {
    placeholder: T.string({ defaultValue: "Search..." }),
    search: T.function(),
    variant: T.string({ defaultValue: "default" }),
    size: T.string({ defaultValue: "md" }),
    results: T.array({ defaultValue: [] }),
  },
  _theme: {
    "": "block relative",
    ".uix-search__input": `border-1 ${defaultTheme.borderRadius} w-full h-full ${genTheme('variant', Object.keys(SearchVariants), (entry) => SearchVariants[entry], { string: true })}`,
    ...genTheme('size', SearchSizes, (entry) => ["w-" + sizeMap[entry], "h-" + sizeMap[entry]].join(" ")),
    ".result-item": "p-2 hover:bg-gray-100 cursor-pointer",
    ".result-item:hover": "bg-gray-100",
  },
  searchHandler(event) {
    const query = event.target.value;
    if (this.search) {
      this.search(query).then(results => {
        this.results = results;
        this.requestUpdate();
      });
    }
  },
  render() {
    const { results = [] } = this;
    return html`
      <uix-container gap="xs">
        <input
          class="uix-search__input"
          type="search"
          placeholder=${this.placeholder}
          @input=${this.searchHandler.bind(this)}
          list="search-results"
          variant=${this.variant}
          size=${this.size}
        />
        <datalist id="search-results">
          ${results?.map(result => html`<option class="result-item" value=${result}></option>`)}
        </datalist>
      </uix-container>
    `;
  },
  selectResult(result) {
    const input = this.shadowRoot.querySelector('.uix-search__input');
    input.value = result;
    this.searchHandler({ target: input });
  },
};

export default Search;
