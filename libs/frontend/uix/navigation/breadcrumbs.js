import { html, T, genTheme } from "helpers";

const BreadcrumbVariants = {
  default: "",
  bordered: "border border-gray-300",
  background: "bg-gray-100",
  rounded: "rounded-md",
  shadow: "shadow-md",
  large: "text-lg p-2",
  small: "text-xs p-1",
};

const Breadcrumb = {
  tag: "uix-breadcrumbs",
  props: {
    variant: T.string({ defaultValue: "default" }),
  },
  _theme: {
    "": `flex items-center text-sm`,
    "[&_*]": "p-4",
    ...genTheme('variant', Object.keys(BreadcrumbVariants), (entry) => BreadcrumbVariants[entry]),
  },
  render() {
    return html`
      <uix-container horizontal role="navigation" aria-label="Breadcrumb" data-theme="uix-breadcrumb">
        <slot></slot>
      </uix-container>
    `;
  },
};

export default Breadcrumb;
