import { html, T } from "frontend";
const Testimonial = {
  tag: "uix-testimonial",
  props: {
    quote: T.string(),
    author: T.string(),
  },
  theme: {
    "uix-testimonial__quote": "text-xl mb-4",
    "uix-testimonial__author": "font-semibold",
  },
  render() {
    return html`
      <uix-card>
        <uix-text class="uix-testimonial__quote">${this.quote}</uix-text>
        <uix-text class="uix-testimonial__author">${this.author}</uix-text>
      </uix-card>
    `;
  },
};
export default Testimonial;
