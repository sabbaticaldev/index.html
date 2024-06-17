import presetIcons from "https://esm.sh/@unocss/preset-icons/browser";
import presetUno from "https://esm.sh/@unocss/preset-uno";
import presetWebFonts from "https://esm.sh/@unocss/preset-web-fonts";
import init from "https://esm.sh/@unocss/runtime";

const getUnoGenerator = (shortcuts = []) => {
  if (window.__unocss_runtime) {
    delete window.__unocss_runtime;
    document
      .querySelectorAll("style[data-unocss-runtime-layer]")
      .forEach((el) => el.remove());
  }
  const config = {
    defaults: {
      shortcuts,
      preflights: false,
      presets: [
        presetUno(),
        presetIcons({
          cdn: "https://esm.sh/",
        }),
        presetWebFonts({
          provider: "google",
          fonts: {
            "primary-font": "Roboto",
            sans: "Roboto",
            "secondary-font":
              window.__custom && window.__custom.fonts.secondary
                ? window.__custom.fonts.secondary
                : "Open Sans",
          },
        }),
      ],
    },
  };

  init(config);
  return window.__unocss_runtime;
};

export default getUnoGenerator;
