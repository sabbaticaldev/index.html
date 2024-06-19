import "../layout/container.js";

import { ReactiveView } from "frontend";
import { genTheme, html, T } from "frontend";
const BreadcrumbVariants = {
  default: "",
  bordered: "border border-gray-300",
  background: "bg-gray-100",
  rounded: "rounded-md",
  shadow: "shadow-md",
  large: "text-lg p-2",
  small: "text-xs p-1",
};

class Breadcrumb extends ReactiveView {
  static get properties() {
    return {
      variant: T.string({ defaultValue: "default" }),
    };
  }

  static theme = {
    "": "flex items-center text-sm",
    "[&_*]": "p-4",
    ...genTheme(
      "variant",
      Object.keys(BreadcrumbVariants),
      (entry) => BreadcrumbVariants[entry],
    ),
  };

  render() {
    return html`
      <uix-container
        horizontal
        role="navigation"
        aria-label="Breadcrumb"
        class="uix-breadcrumb"
      >
        <slot></slot>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-breadcrumbs", Breadcrumb);
