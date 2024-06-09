import { html, T } from "helpers";

export default {
  tag: "uix-search",
  props: {
    placeholder: T.string({ defaultValue: "Search..." }),
    search: T.function(),
  },
  render() {
    return html`
      <uix-input
        type="search"
        placeholder=${this.placeholder}
        @input=${this.search}
      ></uix-input>
    `;
  },
};
