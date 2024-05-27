import { html, T } from "helpers";

const Testimonial = {
  props: {
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
      <div class=${this.theme("uix-testimonial")}>
        <p class=${this.theme("uix-testimonial__quote")}>${this.quote}</p>
        <p class=${this.theme("uix-testimonial__author")}>${this.author}</p>
      </div>
    `;
  },
};

export default Testimonial;
