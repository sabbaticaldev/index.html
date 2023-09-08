import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import lit from "@astrojs/lit";
import { bootstrappAstro } from "./bootstrapp.config.js";

export default defineConfig({
  integrations: [
    AstroPWA({
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
    }),
    bootstrappAstro(),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    lit(),
    starlight({
      title: "Bootstrapp",
      social: {
        github: "https://github.com/withastro/starlight",
      },
    }),
  ],
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
});
