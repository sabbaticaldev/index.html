import { html, T, genTheme, ifDefined } from "helpers";

const BreadcrumbItemVariants = {
  default: "",
  bordered: "border-r border-gray-300",
  background: "bg-gray-100",
  rounded: "rounded-md",
  shadow: "shadow-md",
  large: "text-lg p-2",
  small: "text-xs p-1",
};

const BreadcrumbItem = {
  tag: "uix-breadcrumb-item",
  props: {
    label: T.string(),
    icon: T.string(),
    active: T.boolean({ defaultValue: false }),
    href: T.string(),
    variant: T.string({ defaultValue: "default" }),
  },
  _theme: {
    "": `text-gray-500 hover:text-gray-700 px-2 first:pl-0`,
    ".uix-breadcrumb__separator": "text-gray-400 px-2",
    ...genTheme('variant', Object.keys(BreadcrumbItemVariants), (entry) => BreadcrumbItemVariants[entry]),
    ".uix-breadcrumb__item--active": "text-blue-600 font-bold",
  },
  render() {
    return html`
      ${this.active
        ? html`<span class="uix-breadcrumb__item--active">${renderItem(this)}</span>`
        : html`<uix-container horizontal items="center"><uix-link href=${this.href}>${renderItem(this)}</uix-link><span class="uix-breadcrumb__separator">›</span></uix-container>`}
      `;
  },
};

const renderItem = (item) => html`
    <uix-text icon=${ifDefined(item.icon)}>${item.label}</uix-text>
`;

export default BreadcrumbItem;
