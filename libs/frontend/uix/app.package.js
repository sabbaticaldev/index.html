import { html, T } from "helpers";

const AppShell = {
  props: { containerClass: T.string() },
  render() {
    const { containerClass = "" } = this;
    return html`
      <div class=${this.generateTheme("uix-app-shell") + containerClass && ` ${containerClass}` || ""}>
        <slot name="top-navbar"></slot>
        <div class=${this.generateTheme("uix-app-shell__content")}>
          <slot name="left-navbar"></slot>
          <main class=${this.generateTheme("uix-app-shell__main")}>
            <slot></slot>
          </main>
          <slot name="right-navbar"></slot>
        </div>
        <slot name="bottom-navbar"></slot>
      </div>
    `;
  },
};

const Router = {
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

export default {
  i18n: {},
  views: {
    "uix-app-shell": AppShell,
    "uix-router": Router,
  },
};

