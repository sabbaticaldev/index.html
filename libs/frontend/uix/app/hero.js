import { html, T } from "helpers";

const Hero = {
  props: {
    title: T.string(),
    subtitle: T.string(),
    buttonText: T.string(),
    buttonClick: T.function(),
  },
  theme: {
    "uix-hero": "bg-gray-100 py-20",
    "uix-hero__container": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
    "uix-hero__title": "text-4xl sm:text-5xl font-extrabold mb-4",
    "uix-hero__subtitle": "text-xl sm:text-2xl text-gray-600 mb-8",
  },
  render() {
    return html`
      <section class=${this.theme("uix-hero")}>
        <div class=${this.theme("uix-hero__container")}>
          <uix-text class=${this.theme("uix-hero__title")} size="4xl"
            >${this.title}</uix-text
          >
          <p class=${this.theme("uix-hero__subtitle")}>${this.subtitle}</p>
          <uix-button variant="primary" @click=${this.buttonClick}
            >${this.buttonText}</uix-button
          >
        </div>
      </section>
    `;
  },
};

export default Hero;
