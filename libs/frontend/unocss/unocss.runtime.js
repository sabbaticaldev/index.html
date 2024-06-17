import presetIcons from "https://esm.sh/@unocss/preset-icons/browser";
import presetUno from "https://esm.sh/@unocss/preset-uno";
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
      ],
    },
  };

  init(config);
  return window.__unocss_runtime;
};

export default getUnoGenerator;
