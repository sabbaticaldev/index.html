import { html, T } from "helpers";
const Hero = {
  tag: "uix-hero",
  props: {
    title: T.string(),
    subtitle: T.string(),
    buttonText: T.string(),
    buttonClick: T.function(),
  },
  theme: {
    "uix-hero__block": "bg-gray-100 py-20",
    "uix-hero": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
    "uix-hero__title": "text-4xl sm:text-5xl font-extrabold mb-4",
    "uix-hero__subtitle": "text-xl sm:text-2xl text-gray-600 mb-8",
  },
  render() {
    return html`
      <uix-block data-theme="uix-hero__block">
        <uix-text data-theme="uix-hero__title" size="4xl"
          >${this.title}</uix-text
      <uix-block data-theme="uix-hero__block">
        <uix-text data-theme="uix-hero__title" size="4xl"
          >${this.subtitle}</uix-text
        >
        <uix-text data-theme="uix-hero__subtitle"
          >${this.buttonText}</uix-button
        >
      </uix-block>
    `;
  },
};
export default Hero;
