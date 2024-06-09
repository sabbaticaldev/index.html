import { html, T } from "helpers";
export default {
  tag: "uix-file-input",
  props: {
    accept: T.string(),
    multiple: T.boolean(),
    change: T.function(),
  },
  render() {
    const { accept, multiple, change } = this;
    return html`
      <input
        type="file"
        ?accept=${accept}
        ?multiple=${multiple}
        @change=${change}
      />
    `;
  },
};
