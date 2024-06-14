import { html, T } from "helpers";

export default {
  tag: "uix-accordion",
  props: {
    multiple: T.boolean(),
    border: T.boolean(),
  },

  _theme: {
    "": "divide-y divide-gray-800 block text-left",
  },
  render() {
    return html`<uix-container padding="sm">
      <slot></slot>
    </uix-container> `;
  },
};