import { html, T } from "helpers";

const Rating = {
  props: {
    value: T.number({ defaultValue: 0 }),
    max: T.number({ defaultValue: 5 }),
    readonly: T.boolean({ defaultValue: false }),
    change: T.function(),
  },
  theme: {
    "uix-rating": "flex items-center",
    "uix-rating__star": ({ filled }) => ({
      _base: "w-5 h-5 fill-current text-gray-300",
      filled: {
        true: "text-yellow-400",
      },
    }),
  },
  render() {
    const { value, max, readonly, change } = this;

    return html`
      <div class=${this.theme("uix-rating")}>
        ${Array.from(
    { length: max },
    (_, index) => html`
            <svg
              class=${this.theme("uix-rating__star", {
                filled: index < value,
  })}
              viewBox="0 0 20 20"
              @click=${() => !readonly && change(index + 1)}
            >
              <path
                d="M10 1.667l2.583 5.25 5.75.833-4.166 4.084 1 5.833L10 15.25l-5.167 2.667 1-5.833L1.667 7.75l5.75-.833L10 1.667z"
              />
            </svg>
          `,
  )}
      </div>
    `;
  },
};

export default Rating;
