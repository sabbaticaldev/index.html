import { html, T } from "helpers";
const Testimonial = {
  props: {
    tag: "uix-testimonial",
    quote: T.string(),
    author: T.string(),
  },
  theme: {
    "uix-testimonial": "bg-white shadow-lg rounded-lg p-6",
    "uix-testimonial__quote": "text-xl mb-4",
    "uix-testimonial__author": "font-semibold",
  },
  render() {
    return html`
      <uix-block class=${this.theme("uix-testimonial")}>
        <uix-text class=${this.theme("uix-testimonial__quote")}
          >${this.quote}</uix-text
        >
        <uix-text class=${this.theme("uix-testimonial__author")}
          >${this.author}</uix-text
        >
      </uix-block>
    `;
  },
};
export default Testimonial;
