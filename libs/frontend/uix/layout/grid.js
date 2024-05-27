import { html, T } from "helpers";

const Grid = {
  props: {
    cols: T.string({ defaultValue: "1" }),
    rows: T.string({ defaultValue: "1" }),
    gap: T.string({ defaultValue: "0" }),
  },
  theme: {
    "uix-grid": ({ cols, rows, gap }) =>
      `grid grid-cols-${cols} grid-rows-${rows} gap-${gap}`,
  },
  render() {
    return html`
      <div class=${this.theme("uix-grid")}>
        <slot></slot>
      </div>
    `;
  },
};

export default Grid;
