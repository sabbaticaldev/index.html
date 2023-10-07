const AlignX = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const AlignY = {
  top: 'items-start',
  middle: 'items-center',
  bottom: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};
const FontWeight = {
  thin: 'font-thin', // 200
  extralight: 'font-extralight', // 100
  light: 'font-light', // 300
  normal: 'font-normal', // 400
  medium: 'font-medium', // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold', // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black', // 900
};

const BgOverlayOpacity = {
  10: 'bg-opacity-10',
  20: 'bg-opacity-20',
  30: 'bg-opacity-30',
  40: 'bg-opacity-40',
  50: 'bg-opacity-50',
  60: 'bg-opacity-60',
  70: 'bg-opacity-70',
  80: 'bg-opacity-80',
  90: 'bg-opacity-90',
  100: 'bg-opacity-100',
};

const Gaps = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
  xl: 'gap-16',
  '2xl': 'gap-32',
  '3xl': 'gap-64',
  '4xl': 'gap-96',
};

const Positions = [
  'start',
  'center',
  'end',
  'top',
  'middle',
  'bottom',
  'top',
  'end',
  'bottom',
  'middle',
  'left',
  'right',
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
];
const Resolutions = ['sm', 'md', 'lg', 'xl'];
const NavbarPart = ['start', 'center', 'end'];
const Layouts = ['default', 'responsive'];
const Spacings = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const AnimationTypes = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'];
const ModalPositions = {
  top: 'modal-top',
  middle: 'modal-middle',
  bottom: 'modal-bottom',
};
const Methods = ['details', 'focus'];
const Sizes = ['lg', 'md', 'sm', 'xs', 'xl', '2xl', '3xl', '4xl'];
const TabsSize = { lg: 'tab-lg', md: 'tab-md', sm: 'tab-sm', xs: 'tab-xs' };
const Shapes = ['default', 'circle', 'square'];
const Styles = [
  'ghost',
  'link',
  'outline',
  'glass',
  'active',
  'disabled',
  'bordered',
];
const Triggers = ['click', 'hover'];
const Directions = ['horizontal', 'vertical', 'responsive'];
const Formats = ['DHMS', 'HMS', 'MS', 'S'];
const Variants = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'base',
  'info',
  'success',
  'warning',
  'error',
];
const BgColor = {
  primary: 'bg-primary-200',
  secondary: 'bg-secondary-200',
  accent: 'bg-accent-200',
  neutral: 'bg-neutral-200',
  base: 'bg-base-200',
  info: 'bg-info-200',
  success: 'bg-success-200',
  warning: 'bg-warning-200',
  error: 'bg-error-200',
};

const TextColor = {
  primary: 'text-primary-focus',
  secondary: 'text-secondary-focus',
  accent: 'text-accent-focus',
  neutral: 'text-neutral-focus',
  base: 'text-base-focus',
  info: 'text-info-focus',
  success: 'text-success-focus',
  warning: 'text-warning-focus',
  error: 'text-error-focus',
};

const ButtonVariant = {
  default: 'btn-default',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  neutral: 'btn-neutral',
  base: 'btn-base',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
};
const BorderColor = {
  primary: 'border-primary-content',
  secondary: 'border-secondary-content',
  accent: 'border-accent-content',
  neutral: 'border-neutral-content',
  base: 'border-base-content',
  info: 'border-info-content',
  success: 'border-success-content',
  warning: 'border-warning-content',
  error: 'border-error-content',
};
const CheckboxVariant = {
  default: 'checkbox-default',
  primary: 'checkbox-primary',
  secondary: 'checkbox-secondary',
  accent: 'checkbox-accent',
  neutral: 'checkbox-neutral',
  base: 'checkbox-base',
  info: 'checkbox-info',
  success: 'checkbox-success',
  warning: 'checkbox-warning',
  error: 'checkbox-error',
};

const CheckboxSize = {
  lg: 'checkbox-lg',
  md: 'checkbox-md',
  sm: 'checkbox-sm',
  xs: 'checkbox-xs',
};

const CollapseBgColor = {
  primary: 'bg-primary-200',
  secondary: 'bg-secondary-200',
  accent: 'bg-accent-200',
  neutral: 'bg-neutral-200',
  base: 'bg-base-200',
  info: 'bg-info-200',
  success: 'bg-success-200',
  warning: 'bg-warning-200',
  error: 'bg-error-200',
};

const CollapseIcon = {
  '': '',
  arrow: 'collapse-arrow',
  plus: 'collapse-plus',
};

const RingColor = {
  primary: 'ring-primary',
  secondary: 'ring-secondary',
  accent: 'ring-accent',
  neutral: 'ring-neutral',
  base: 'ring-base',
  info: 'ring-info',
  success: 'ring-success',
  warning: 'ring-warning',
  error: 'ring-error',
};

const HeadingColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  neutral: 'text-neutral',
  base: 'text-base',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

const LinkColors = {
  primary: 'link-primary hover:text-primary-dark',
  secondary: 'link-secondary hover:text-secondary-dark',
  accent: 'link-accent hover:text-accent-dark',
  neutral: 'link-neutral hover:text-neutral-dark',
  base: 'link-base hover:text-base-dark',
  info: 'link-info hover:text-info-dark',
  success: 'link-success hover:text-success-dark',
  warning: 'link-warning hover:text-warning-dark',
  error: 'link-error hover:text-error-dark',
};

export {
  HeadingColors,
  LinkColors,
  AlignX,
  AlignY,
  FontWeight,
  BgOverlayOpacity,
  ButtonVariant,
  Positions,
  Resolutions,
  Gaps,
  NavbarPart,
  Layouts,
  Spacings,
  AnimationTypes,
  ModalPositions,
  Methods,
  Sizes,
  Shapes,
  Styles,
  Triggers,
  Directions,
  Formats,
  Variants,
  BgColor,
  TabsSize,
  TextColor,
  BorderColor,
  CheckboxVariant,
  CheckboxSize,
  CollapseBgColor,
  CollapseIcon,
  RingColor,
};
