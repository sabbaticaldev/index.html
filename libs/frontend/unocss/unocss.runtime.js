import { presetForms } from "@julr/unocss-preset-forms";
import presetIcons from "https://esm.sh/@unocss/preset-icons/browser";
import presetTypography from "https://esm.sh/@unocss/preset-typography";
import presetUno from "https://esm.sh/@unocss/preset-uno";
import presetWebFonts from "https://esm.sh/@unocss/preset-web-fonts";
import init from "https://esm.sh/@unocss/runtime";

const getUnoGenerator = (safelist = [], shortcuts = []) => {
  const config = {
    defaults: {
      shortcuts,
      safelist,
      presets: [
        presetUno(),
        presetIcons({
          cdn: "https://esm.sh/",
        }),
        presetTypography(),
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
  return window.__unocss_runtime;
};

export default getUnoGenerator;
