import { html, T } from "helpers";

export default {
  props: {
    routes: T.array(),
    currentRoute: T.string(),
  },
  render() {
    const { routes, currentRoute } = this;

    const routeItem = routes.find((route) => route.path === currentRoute);

    return routeItem
      ? html`${routeItem.component}`
      : html`<uix-block>404: Page not found</uix-block>`;
  },
};
