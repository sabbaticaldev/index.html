import "../layout/container.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";

class Router extends ReactiveView {
  static get properties() {
    return {
      routes: T.array(),
      currentRoute: T.string(),
    };
  }

  render() {
    const { routes, currentRoute } = this;

    const routeItem = routes.find((route) => route.path === currentRoute);

    return routeItem
      ? html`${routeItem.component}`
      : html`<uix-container>404: Page not found</uix-container>`;
  }
}

export default ReactiveView.define("uix-router", Router);
