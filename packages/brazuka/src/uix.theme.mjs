const FontWeight = {
  thin: "font-thin", // 200
  extralight: "font-extralight", // 100
  light: "font-light", // 300
  normal: "font-normal", // 400
  medium: "font-medium", // 500
  semibold: "font-semibold", // 600
  bold: "font-bold", // 700
  extrabold: "font-extrabold", // 800
  black: "font-black" // 900
};

const FontType = {
  mono: "font-mono",
  sans: "font-sans",
  serif: "font-serif"
};

const Gaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
  xl: "gap-16",
  "2xl": "gap-32",
  "3xl": "gap-64",
  "4xl": "gap-96"
};

const AnimationTypes = ["spinner", "dots", "ring", "ball", "bars", "infinity"];
const ModalPositions = {
  top: "modal-top",
  middle: "modal-middle",
  bottom: "modal-bottom"
};

const Sizes = ["lg", "md", "sm", "xs", "xl", "2xl", "3xl", "4xl"];
const TabsSize = {
  lg: "tab-lg",
  md: "tab-md",
  sm: "tab-sm",
  xs: "tab-xs"
};
const Shapes = ["default", "circle", "square", "metro"];

const ButtonSizes = {
  lg: "btn-lg",
  md: "",
  sm: "btn-sm",
  xs: "btn-xs"
};

const ButtonShapes = {
  default: "rounded-none",
  rounded: "",
  circle: "btn-circle",
  square: "btn-square"
};

const ButtonVariants = {
  ghost: "btn-ghost",
  link: "btn-link",
  outline: "btn-outline",
  glass: "btn-glass",
  active: "btn-active",
  disabled: "btn-disabled",
  bordered: "btn-bordered"
};

const Variants = [
  "ghost",
  "link",
  "outline",
  "glass",
  "active",
  "disabled",
  "bordered"
];
const RadioVariantClass = {
  primary: "radio-primary",
  secondary: "radio-secondary",
  accent: "radio-accent",
  neutral: "radio-neutral",
  base: "radio-base",
  info: "radio-info",
  success: "radio-success",
  warning: "radio-warning",
  error: "radio-error"
};

const RadioSizeClass = {
  md: "radio-md",
  sm: "radio-sm",
  lg: "radio-lg",
  xs: "radio-xs"
};
const InputVariantClass = {
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  neutral: "input-neutral",
  base: "input-base",
  info: "input-info",
  success: "input-success",
  warning: "input-warning",
  error: "input-error"
};

const InputStyleClass = {
  ghost: "input-ghost",
  link: "input-link",
  outline: "input-outline",
  glass: "input-glass",
  active: "input-active",
  disabled: "input-disabled",
  bordered: "input-bordered"
};

const InputSizeClass = {
  lg: "input-lg",
  md: "input-md",
  sm: "input-sm",
  xs: "input-xs"
};

const SelectColors = {
  primary: "select-primary",
  secondary: "select-secondary",
  accent: "select-accent",
  neutral: "select-neutral",
  base: "select-base",
  info: "select-info",
  success: "select-success",
  warning: "select-warning",
  error: "select-error"
};

const TextareaColors = {
  primary: "textarea-primary",
  secondary: "textarea-secondary",
  accent: "textarea-accent",
  neutral: "textarea-neutral",
  base: "textarea-base",
  info: "textarea-info",
  success: "textarea-success",
  warning: "textarea-warning",
  error: "textarea-error"
};

const TextareaSizes = {
  lg: "textarea-lg h-40",
  md: "textarea-md h-30",
  sm: "textarea-sm h-20",
  xs: "textarea-xs h-10"
};

const SelectSizes = {
  lg: "select-lg",
  md: "select-md",
  sm: "select-sm",
  xs: "select-xs"
};

const Colors = [
  "default",
  "primary",
  "secondary",
  "accent",
  "neutral",
  "base",
  "info",
  "success",
  "warning",
  "error"
];

const BgColor = {
  white: "bg-white",
  black: "bg-black",
  primary: "bg-primary-200",
  secondary: "bg-secondary-200",
  accent: "bg-accent-200",
  neutral: "bg-neutral-200",
  base: "bg-base-200",
  info: "bg-info-200",
  success: "bg-success-200",
  warning: "bg-warning-200",
  error: "bg-error-200"
};

const BadgeColor = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  ghost: "badge-ghost",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  outline: "badge-outline"
};

const TextColor = {
  primary: "text-primary-focus",
  secondary: "text-secondary-focus",
  accent: "text-accent-focus",
  neutral: "text-neutral-focus",
  base: "text-base-focus",
  info: "text-info-focus",
  success: "text-success-focus",
  warning: "text-warning-focus",
  error: "text-error-focus"
};

const ButtonColors = {
  default: "btn-default",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  base: "btn-base",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error"
};

const BorderColor = {
  primary: "border-primary-content",
  secondary: "border-secondary-content",
  accent: "border-accent-content",
  neutral: "border-neutral-content",
  base: "border-base-content",
  info: "border-info-content",
  success: "border-success-content",
  warning: "border-warning-content",
  error: "border-error-content"
};
const CheckboxVariant = {
  default: "checkbox-default",
  primary: "checkbox-primary",
  secondary: "checkbox-secondary",
  accent: "checkbox-accent",
  neutral: "checkbox-neutral",
  base: "checkbox-base",
  info: "checkbox-info",
  success: "checkbox-success",
  warning: "checkbox-warning",
  error: "checkbox-error"
};

const CheckboxSize = {
  lg: "checkbox-lg",
  md: "checkbox-md",
  sm: "checkbox-sm",
  xs: "checkbox-xs"
};
const HeadingColors = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  neutral: "text-neutral",
  base: "text-base",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error"
};

const BlockColors = {
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  neutral: "bg-neutral text-neutral-content",
  base: "bg-base text-base-content",
  info: "bg-info text-info-content",
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  error: "bg-error text-error-content"
};

const SpacingSizes = {
  "": "",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
  "3xl": "p-16",
  "4xl": "p-24"
};

const TextSizes = {
  "": "",
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl"
};

const LeadingSizes = {
  "": "",
  xs: "leading-3",
  sm: "leading-4",
  base: "leading-5",
  md: "leading-6",
  lg: "leading-7",
  xl: "leading-8",
  "2xl": "leading-9",
  "3xl": "leading-10"
};

export const RingColor = {
  primary: "ring-primary",
  secondary: "ring-secondary",
  accent: "ring-accent",
  neutral: "ring-neutral",
  base: "ring-base",
  info: "ring-info",
  success: "ring-success",
  warning: "ring-warning",
  error: "ring-error"
};

export const JustifyContent = {
  normal: "justify-normal",
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
  strecth: "justify-stretch"
};

const DefaultTheme = {
  "uix-card": {
    border: { true: "border" },
    bg: BgColor,
    text: TextColor,
    shadow: { true: "shadow" },
    rounded: { false: "rounded-none" },
    spacing: SpacingSizes
  },
  "uix-block": {
    bgColor: BgColor,
    text: TextColor,
    spacing: SpacingSizes,
    rounded: { false: "rounded-none", true: "rounded" },
    shadow: { false: "", true: "shadow-md" },
    color: BlockColors
  },

  "uix-list": {
    _base: "flex w-full h-full",
    spacing: SpacingSizes,
    gap: Gaps,
    justify: JustifyContent,
    rounded: { true: "rounded-l-full rounded-r-full" },
    vertical: { true: "flex-col" },
    responsive: ({ vertical }) => ({
      true: vertical ? "lg:flex-col sm:flex-row" : "sm:flex-col lg:flex-row"
    }),
    reverse: ({ vertical }) => ({
      true: vertical ? "flex-col-reverse" : "flex-row-reverse"
    })
  }
};

const generateTheme = (element, props) => {
  const defaultElement = DefaultTheme[element];
  const classes =
    defaultElement &&
    Object.keys(defaultElement).map((attr) => {
      const elementTheme =
        defaultElement[attr] && defaultElement[attr][props[attr]];
      return typeof elementTheme === "function" ? elementTheme() : elementTheme;
    });
  classes.push(defaultElement["_base"], props["containerClass"]);
  return classes.filter(Boolean).join(" ") || "";
};

export {
  generateTheme,
  BgColor,
  Colors,
  AnimationTypes,
  BadgeColor,
  TextColor,
  TextSizes,
  LeadingSizes,
  HeadingColors,
  FontWeight,
  FontType,
  TabsSize,
  Gaps,
  ModalPositions,
  Sizes,
  ButtonColors,
  ButtonSizes,
  ButtonShapes,
  ButtonVariants,
  Shapes,
  Variants,
  BorderColor,
  CheckboxVariant,
  CheckboxSize,
  InputVariantClass,
  TextareaColors,
  TextareaSizes,
  InputStyleClass,
  InputSizeClass,
  RadioVariantClass,
  RadioSizeClass,
  SelectColors,
  SelectSizes,
  SpacingSizes,
  BlockColors
};
