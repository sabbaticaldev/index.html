import { presetForms } from "@julr/unocss-preset-forms";
import presetAttributify from "https://esm.sh/@unocss/preset-attributify";
import presetIcons from "https://esm.sh/@unocss/preset-icons/browser";
import presetUno from "https://esm.sh/@unocss/preset-uno";
import presetWebFonts from "https://esm.sh/@unocss/preset-web-fonts";
import init from "https://esm.sh/@unocss/runtime";
import { UnoTheme } from "../reactive-view/index.js";

// pass unocss options
// TODO Handle undefined
window.__unocss = {
  theme: window.__custom && window.__custom.theme ? window.__custom.theme : {},
};

const getUnoGenerator = () => {
  console.log(UnoTheme, Array.from(UnoTheme));
  const config = {
    defaults: {
      safelist: Array.from(UnoTheme),
      presets: [
        presetUno(),
        presetIcons({
          cdn: "https://esm.sh/",
        }),
        presetAttributify(),
        presetForms(),
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
  if (window.__unocss_runtime) {
    const uno = window.__unocss_runtime;
    return uno;
  }
};

export default getUnoGenerator;
