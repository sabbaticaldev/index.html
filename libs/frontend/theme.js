const createMapping = (prefix, mapping) =>
  Object.fromEntries(Object.entries(mapping).map(([key, value]) => [key, `${prefix}-${value}`]));

const FontWeight = createMapping("font", {
  thin: "thin", extralight: "extralight", light: "light", normal: "normal",
  medium: "medium", semibold: "semibold", bold: "bold",
  extrabold: "extrabold", black: "black"
});

const FontType = createMapping("font", {
  mono: "mono", sans: "sans", serif: "serif"
});

const Gaps = createMapping("gap", {
  sm: 2, md: 4, lg: 8, xl: 16, "2xl": 32, "3xl": 64, "4xl": 96
});

export const Sizes = ["lg", "md", "sm", "xs", "xl", "2xl", "3xl", "4xl"];
export const Variants = ["default", "primary", "secondary", "accent", "neutral", "base", "info", "success", "warning", "error"];

const TextSizes = createMapping("text", {
  "": "", xs: "xs", sm: "sm", base: "base", md: "md", lg: "lg", xl: "xl",
  "2xl": "2xl", "3xl": "3xl", "4xl": "4xl", "5xl": "5xl", "6xl": "6xl"
});

const LeadingSizes = createMapping("leading", {
  "": "", xs: 3, sm: 4, base: 5, md: 6, lg: 7, xl: 8, "2xl": 9, "3xl": 10, "4xl": 10, "5xl": 10, "6xl": 10
});

export const JustifyContent = createMapping("justify", {
  normal: "normal", start: "start", end: "end", center: "center", between: "between",
  around: "around", evenly: "evenly", stretch: "stretch"
});

const SpacingSizes = createMapping("p", {
  "": "", xs: 1, sm: 2, md: 4, lg: 6, xl: 8, "2xl": 12, "3xl": 16, "4xl": 24
});

const ButtonSizes = {
  "": "", xs: "p-1", sm: "p-2", md: "px-4 py-2", lg: "px-6 py-3", xl: "px-8 py-4",
  "2xl": "px-12 py-5", "3xl": "px-16 py-6", "4xl": "px-24 py-7"
};

const DimensionSizes = createMapping("w", {
  "": "", xs: "6 h-6", sm: "8 h-8", md: "12 h-12", lg: "16 h-16", xl: "24 h-24",
  "2xl": "32 h-32", "3xl": "48 h-48", "4xl": "64 h-64"
});

const trackingSizes = createMapping("tracking", {
  "4xl": "wider", "3xl": "wider", "2xl": "wider", xl: "wide", lg: "wide"
});

const generateClass = (prefix, color, variation) => `${prefix}-${color}-${variation}`;
const generateColorClass = (color, variation) => generateClass("bg", color, variation);
const generateTextColorClass = (color, variation) => generateClass("text", color, variation);
const generateBorderColorClass = (color, variation) => generateClass("border", color, variation);

const generateTextColorVariants = (textVariation, colors) => 
  Object.fromEntries(Object.keys(colors).map(colorKey => [colorKey, generateTextColorClass(colors[colorKey], textVariation)]));

const generateVariants = (variantSettings, colors) => {
  const { bgVariation, textVariation, hoverBgVariation, hoverTextVariation, accentVariation } = variantSettings;
  const textColorVariants = generateTextColorVariants(textVariation, colors);
  return Object.fromEntries(Object.keys(colors).map(colorKey => {
    const color = colors[colorKey];
    const accentClass = accentVariation && colorKey === "accent" ? `accent-${color}-${accentVariation}` : "";
    const classes = [
      generateColorClass(color, bgVariation),
      `hover:${generateColorClass(color, hoverBgVariation)}`,
      textColorVariants[colorKey],
      `hover:${generateTextColorClass(color, hoverTextVariation)}`,
      accentClass,
      generateBorderColorClass(color, "900")
    ];
    return [colorKey, classes.filter(Boolean).join(" ")];
  }));
};

const cls = (arr) => arr.filter(Boolean).join(" ");

export const generateTheme = (userTheme) => {
  const BaseVariants = generateVariants(userTheme.baseVariants, userTheme.colors);
  const ReverseVariants = generateVariants(userTheme.reverseVariants, userTheme.colors);
  const TextColors = generateTextColorVariants(userTheme.textVariant, userTheme.colors);
  const borderRadius = roundedClasses[userTheme.borderRadius || 0];

  const commonStyles = {
    _base: cls([userTheme.flexCenter, userTheme.borderStyles, borderRadius]),
    variant: BaseVariants,
    size: [SpacingSizes, TextSizes]
  };

  return {
    "uix-avatar": { ...commonStyles, size: DimensionSizes },
    "uix-avatar__img": { _base: "", size: DimensionSizes },
    "uix-badge": { ...commonStyles, size: [SpacingSizes, TextSizes] },
    "uix-input": {
      _base: cls(["block w-full appearance-none focus:outline-none focus:ring-0", userTheme.defaultTextColor, userTheme.borderStyles, userTheme.borderWidth, borderRadius]),
      active: {
        true: cls([userTheme.activeTextColor, "border-blue-500"]),
        false: cls([userTheme.defaultTextColor, userTheme.hoverBorder])
      },
      variant: BaseVariants,
      size: [SpacingSizes, TextSizes]
    },
    "uix-input__label": {
      variant: BaseVariants,
      _base: cls(["absolute text-sm duration-300 transform -translate-y-4 scale-75 top-0.5 z-10 origin-[0] left-2.5",
        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"])
    },
    "uix-label": { ...commonStyles },
    "uix-textarea": { ...commonStyles, active: commonStyles.active },
    "uix-dropdown": { ...commonStyles, active: commonStyles.active },
    "uix-modal": { _base: cls(["rounded-lg bg-white p-8 shadow-2xl min-w-[768px] min-h-[400px]", borderRadius]), size: SpacingSizes },
    "uix-card": { _base: "shadow", spacing: SpacingSizes, variant: BaseVariants },
    "uix-block": { spacing: SpacingSizes, variant: BaseVariants },
    "uix-list": {
      _base: "flex", spacing: SpacingSizes, gap: Gaps, justify: JustifyContent,
      full: ({ vertical }) => ({ true: vertical ? "w-full" : "h-full" }),
      vertical: { true: "flex-col" },
      responsive: ({ vertical }) => ({ true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row" }),
      reverse: ({ vertical }) => ({ true: vertical ? "flex-col-reverse" : "flex-row-reverse" })
    },
    "uix-divider": { _base: "flex items-center my-2", spacing: SpacingSizes },
    "uix-divider__border": { _base: "border-t border-gray-400 flex-grow" },
    "uix-divider__label": { _base: "px-3 text-gray-800 font-bold text-2xl" },
    "uix-button": {
      _base: cls(["cursor-pointer transition ease-in-out duration-200 gap-2 w-full", userTheme.flexCenter, userTheme.fontStyles, borderRadius]),
      variant: ReverseVariants,
      size: [ButtonSizes, TextSizes]
    },
    "uix-icon-button": { _base: cls(["transition ease-in-out duration-200 mx-auto", borderRadius]), variant: BaseVariants },
    "uix-icon-button__icon": { _base: cls(["mx-auto"]), size: TextSizes },
    "uix-tooltip": { _base: cls(["group relative m-12", borderRadius]), spacing: SpacingSizes },
    "uix-tooltip__button": { _base: cls(["bg-gray-500 px-4 py-2 text-sm shadow-sm text-white", borderRadius]), variant: BaseVariants, spacing: SpacingSizes },
    "uix-tooltip__content": { _base: "absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-white text-xs group-hover:scale-100", spacing: SpacingSizes },
    "uix-tabs": { _base: "flex w-full overflow-x-auto overflow-y-hidden border-gray-200", variant: BaseVariants, spacing: SpacingSizes, full: { true: "w-full h-full" } },
    "uix-tab": {
      _base: cls(["relative group", userTheme.flexCenter, "px-2 py-2 -mb-px sm:px-4 -px-1 whitespace-nowrap focus:outline-none", userTheme.borderStyles, userTheme.borderWidth]),
      active: {
        true: cls([userTheme.activeTextColor, "border-blue-500"]),
        false: cls([userTheme.defaultTextColor, userTheme.hoverBorder])
      },
      variant: BaseVariants,
      size: SpacingSizes
    },
    "uix-tab_summary": { _base: "cursor-pointer" },
    "uix-range": { _base: "w-full", variant: BaseVariants },
    "uix-checkbox": {
      _base: cls(["before:content[''] peer before:transition-opacity hover:before:opacity-10 checked:opacity-100 opacity-30", clipRoundedClasses[userTheme.borderRadius]]),
      variant: ReverseVariants,
      size: DimensionSizes
    },
    "uix-select": { _base: "w-full", border: { true: "border" }, full: { true: "w-full" }, size: SpacingSizes },
    "uix-text": { _base: "", variant: TextColors, weight: FontWeight, font: FontType, leading: LeadingSizes, size: [LeadingSizes, trackingSizes, TextSizes] }
  };
};

const resolveThemeValue = (elementTheme, key = "") => Array.isArray(elementTheme)
  ? elementTheme.map((entry) => entry[key]).join(" ")
  : typeof elementTheme[key] === "function"
    ? elementTheme[key]()
    : elementTheme[key];

export const getElementTheme = (element, props) => {
  const defaultElement = Theme[element];
  if (!defaultElement) return props["containerClass"] || "";

  const classes = Object.keys(defaultElement).reduce((acc, attr) => {
    const elementTheme = defaultElement[attr];
    const resolvedThemeValue = resolveThemeValue(elementTheme, props[attr]);
    if (resolvedThemeValue) acc.push(resolvedThemeValue);
    return acc;
  }, []);

  if (defaultElement["_base"]) classes.push(defaultElement["_base"]);
  if (props["containerClass"]) classes.push(props["containerClass"]);

  return classes.join(" ");
};

const roundedClasses = [
  "rounded-none", "rounded-sm", "rounded", "rounded-md", "rounded-lg",
  "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"
];

const clipRoundedClasses = [
  "[clip-path:circle(0% at 50% 50%)]", "[clip-path:circle(10% at 50% 50%)]",
  "[clip-path:circle(20% at 50% 50%)]", "[clip-path:circle(30% at 50% 50%)]",
  "[clip-path:circle(40% at 50% 50%)]", "[clip-path:circle(50% at 50% 50%)]",
  "[clip-path:circle(60% at 50% 50%)]", "[clip-path:circle(70% at 50% 50%)]",
  "[clip-path:circle(100% at 50% 50%)]"
];

export const baseTheme = {
  colors: {
    default: "gray", primary: "blue", secondary: "pink", accent: "yellow",
    base: "gray", info: "teal", success: "green", warning: "orange", error: "red"
  },
  borderRadius: null,
  fontStyles: "font-bold leading-5 hover:leading-5",
  textVariant: "700",
  defaultTextColor: "text-gray-700",
  activeTextColor: "text-blue-600",
  hoverTextColor: "hover:text-blue-400",
  borderStyles: "border border-gray-300",
  hoverBorder: "hover:border-blue-400",
  borderWidth: "border-b-2",
  flexCenter: "flex flex-row items-center gap-2 text-center justify-center",
  baseVariants: {
    bgVariation: "200",
    textVariation: "700",
    hoverBgVariation: "100",
    hoverTextVariation: "800",
    accentVariation: "400"
  },
  reverseVariants: {
    bgVariation: "700",
    textVariation: "white",
    hoverBgVariation: "600",
    hoverTextVariation: "100",
    accentVariation: "200"
  }
};
export default baseTheme;
let Theme = generateTheme(baseTheme);

export const updateTheme = (theme) => {
  Theme = generateTheme(theme);
  window?.updateAllStyles?.(true, true);
};
