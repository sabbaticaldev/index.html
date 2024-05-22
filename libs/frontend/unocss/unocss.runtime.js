import presetAttributify from "https://esm.sh/@unocss/preset-attributify";
import presetIcons from "https://esm.sh/@unocss/preset-icons/browser";
import presetUno from "https://esm.sh/@unocss/preset-uno";
import presetWebFonts from "https://esm.sh/@unocss/preset-web-fonts";
import init from "https://esm.sh/@unocss/runtime";

// pass unocss options
// TODO Handle undefined
window.__unocss = {
  theme:
    window.__custom && window.__custom.theme ? window.__custom.theme : {},
};

const getUnoGenerator = (safelist) => {
  const config = {
    defaults: {
      safelist,
      presets: [
        presetUno(),
        presetIcons({
          cdn: "https://esm.sh/",
        }),
        presetAttributify(),
        presetWebFonts({
          provider: "google", // google, bunny default provider
          fonts: {
            // these will extend the default theme
            mono: ["Fira Code", "Fira Mono:400,700"],
            // custom ones
            "primary-font":
              window.__custom && window.__custom.fonts.primary
                ? window.__custom.fonts.primary
                : "Roboto",
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
  if (window.__unocss_runtime) {
    const uno = window.__unocss_runtime;
    return uno;
  }
};

export default getUnoGenerator;
