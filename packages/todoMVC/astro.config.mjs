import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import lit from "@astrojs/lit";

export default defineConfig({
  integrations: [
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
