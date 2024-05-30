import baseTheme from "./theme.base.js";

const createMapping = (prefix, mapping) =>
  Object.fromEntries(
    Object.entries(mapping).map(([key, value]) => [key, `${prefix}-${value}`]),
  );

baseTheme.commonColors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "rose",
  "blue-gray",
];

baseTheme.greyColors = ["gray", "zinc", "true-gray", "warm-gray", "blue-gray"];

const baseVariants = {
  thin: "thin",
  extralight: "extralight",
  light: "light",
  normal: "normal",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
  extrabold: "extrabold",
  black: "black",
};

const baseFonts = { mono: "mono", sans: "sans", serif: "serif" };

const baseGaps = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  "2xl": 32,
  "3xl": 64,
  "4xl": 96,
};

const baseTextSizes = {
  "": "",
  xs: "xs",
  sm: "sm",
  base: "base",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
  "3xl": "3xl",
  "4xl": "4xl",
  "5xl": "5xl",
  "6xl": "6xl",
};

const baseLeadingSizes = {
  "": "",
  xs: 3,
  sm: 4,
  base: 5,
  md: 6,
  lg: 7,
  xl: 8,
  "2xl": 9,
  "3xl": 10,
  "4xl": 10,
  "5xl": 10,
  "6xl": 10,
};

const baseJustifyContent = {
  normal: "normal",
  start: "start",
  end: "end",
  center: "center",
  between: "between",
  around: "around",
  evenly: "evenly",
  stretch: "stretch",
};

const baseSpacingSizes = {
  "": "",
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  "2xl": 12,
  "3xl": 16,
  "4xl": 24,
};

const baseButtonSizes = {
  "": "",
  xs: "p-1",
  sm: "p-2",
  md: "px-4 py-2",
  lg: "px-6 py-3",
  xl: "px-8 py-4",
  "2xl": "px-12 py-5",
  "3xl": "px-16 py-6",
  "4xl": "px-24 py-7",
};

const baseDimensionSizes = {
  "": "",
  xs: "6 h-6",
  sm: "8 h-8",
  md: "12 h-12",
  lg: "16 h-16",
  xl: "24 h-24",
  "2xl": "32 h-32",
  "3xl": "48 h-48",
  "4xl": "64 h-64",
};

const baseTrackingSizes = {
  "4xl": "wider",
  "3xl": "wider",
  "2xl": "wider",
  xl: "wide",
  lg: "wide",
};

const roundedClasses = [
  "rounded-none",
  "rounded-sm",
  "rounded",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "rounded-full",
];

const ClipRoundedClasses = [
  "[clip-path:circle(0% at 50% 50%)]",
  "[clip-path:circle(10% at 50% 50%)]",
  "[clip-path:circle(20% at 50% 50%)]",
  "[clip-path:circle(30% at 50% 50%)]",
  "[clip-path:circle(40% at 50% 50%)]",
  "[clip-path:circle(50% at 50% 50%)]",
  "[clip-path:circle(60% at 50% 50%)]",
  "[clip-path:circle(70% at 50% 50%)]",
  "[clip-path:circle(100% at 50% 50%)]",
];

const createProps = (userTheme) => {
  const generateClass = (prefix, color, variation) =>
    `${prefix}-${color}-${variation}`;
  const generateColorClass = (color, variation) =>
    generateClass("bg", color, variation);
  const generateTextColorClass = (color, variation) =>
    generateClass("text", color, variation);
  const generateBorderColorClass = (color, variation) =>
    generateClass("border", color, variation);
  const generateAllColorClasses = (color) =>
    Array.from({ length: 9 }, (_, i) => i + 1).map(
      (shade) => `bg-${color}-${shade}00`,
    );
  const generateTextColorVariants = (textVariation, colors) =>
    Object.fromEntries(
      Object.keys(colors).map((colorKey) => [
        colorKey,
        generateTextColorClass(colors[colorKey], textVariation),
      ]),
    );

  const generateVariants = (variantSettings, colors) => {
    const {
      bgVariation,
      textVariation,
      hoverBgVariation,
      hoverTextVariation,
      accentVariation,
    } = variantSettings;
    const textColorVariants = generateTextColorVariants(textVariation, colors);
    return Object.fromEntries(
      Object.keys(colors).map((colorKey) => {
        const color = colors[colorKey];
        const accentClass =
          accentVariation && colorKey === "accent"
            ? `accent-${color}-${accentVariation}`
            : "";
        const classes = [
          generateColorClass(color, bgVariation),
          `hover:${generateColorClass(color, hoverBgVariation)}`,
          textColorVariants[colorKey],
          `hover:${generateTextColorClass(color, hoverTextVariation)}`,
          accentClass,
          generateBorderColorClass(color, "900"),
        ];
        return [colorKey, classes.filter(Boolean).join(" ")];
      }),
    );
  };

  const cls = (arr) => arr.filter(Boolean).join(" ");
  const borderRadius = roundedClasses[userTheme.borderRadius || 0];
  const BaseVariants = generateVariants(
    userTheme.baseVariants,
    userTheme.colors,
  );
  const ReverseVariants = generateVariants(
    userTheme.reverseVariants,
    userTheme.colors,
  );
  const TextColors = generateTextColorVariants(
    userTheme.textVariant,
    userTheme.colors,
  );
  const commonStyles = {
    _base: cls([userTheme.flexCenter, userTheme.borderStyles, borderRadius]),
    variant: BaseVariants,
    size: [baseSpacingSizes, baseTextSizes],
  };
  // TODO: refactor this, greyColors and commonColors shouldn\'t be in baseTheme
  const ColorPickerClasses = baseTheme.commonColors
    .map(generateAllColorClasses)
    .concat(baseTheme.greyColors.map(generateAllColorClasses));

  return {
    cls,
    Sizes: ["lg", "md", "sm", "xs", "xl", "2xl", "3xl", "4xl"],
    Variants: [
      "default",
      "primary",
      "secondary",
      "accent",
      "neutral",
      "base",
      "info",
      "success",
      "warning",
      "error",
    ],
    SpacingSizes: createMapping("p", baseSpacingSizes),
    TextSizes: createMapping("text", baseTextSizes),
    LeadingSizes: createMapping("leading", baseLeadingSizes),
    DimensionSizes: createMapping("w", baseDimensionSizes),
    BaseVariants,
    ReverseVariants,
    TrackingSizes: createMapping("tracking", baseTrackingSizes),
    ClipRoundedClasses,
    ButtonSizes: baseButtonSizes,
    JustifyContent: createMapping("justify", baseJustifyContent),
    Gaps: createMapping("gap", baseGaps),
    FontType: createMapping("font", baseFonts),
    FontWeight: createMapping("font", baseVariants),
    TextColors,
    borderRadius,
    ColorPickerClasses,
    commonStyles,
    commonColors: baseTheme.commonColors,
    greyColors: baseTheme.greyColors,
    baseTheme,
    generateAllColorClasses,
    generateColorClass,
  };
};

export const extractSafelistFromTheme = () => {
  const safelist = new Set();
  const addClassToSafelist = (className) => {
    if (className) className.split(" ").forEach((cls) => safelist.add(cls));
  };

  const traverseTheme = (obj) => {
    if (typeof obj === "string") addClassToSafelist(obj);
    else if (Array.isArray(obj)) obj.forEach(traverseTheme);
    else if (typeof obj === "object" && obj !== null) {
      Object.values(obj)
        .filter((v) => v)
        .forEach((value) => {
          if (typeof value === "function") {
            traverseTheme(value({}, themeProps));
          } else {
            traverseTheme(value);
          }
        });
    }
  };

  traverseTheme(Theme);
  return Array.from(safelist);
};

export const Theme = {};
export let themeProps = createProps(baseTheme);
export default baseTheme;

export const loadTheme = (views) => {
  Object.keys(views).forEach((key) => {
    const component = views[key];
    const { theme, tag } = component;
    const elementTheme =
      theme && typeof theme === "function" ? theme(themeProps) : theme;
    if (typeof elementTheme === "string") Theme[tag] = elementTheme;
    else if (typeof elementTheme === "object")
      Object.keys(elementTheme).forEach(
        (entry) => (Theme[entry] = elementTheme[entry]),
      );
  });
};

const resolveThemeValue = ({ theme = {}, props = {}, key = "" }) => {
  if (Array.isArray(theme)) {
    return theme.map((entry) => entry && entry[key]).join(" ");
  }
  if (typeof theme === "function") {
    return theme(props);
  }
  return theme[key];
};
export const getElementTheme = (element, extraProps = {}, instance = {}) => {
  const props = { ...extraProps, ...instance };
  const { containerClass } = instance.component || {};
  const elementTheme = Theme[element] || containerClass || "";
  if (typeof elementTheme === "string") {
    return elementTheme;
  }
  if (typeof elementTheme === "function") {
    return resolveThemeValue({
      theme: elementTheme,
      props,
    });
  }
  const classes = Object.entries(elementTheme).reduce((acc, [attr, theme]) => {
    if (attr === "_base") return acc;
    const key = instance[attr] || props[attr];
    const themeValue = resolveThemeValue({
      theme,
      props,
      key,
    });
    if (themeValue) {
      acc.push(typeof themeValue === "object" ? themeValue[key] : themeValue);
    }
    return acc;
  }, []);
  if (elementTheme._base) {
    classes.push(
      typeof elementTheme._base === "function"
        ? elementTheme._base(props)
        : elementTheme._base,
    );
  }
  if (containerClass) {
    classes.push(containerClass);
  }
  return classes.join(" ") || "";
};
