import { html, T } from "helpers";

const AppShell = {
  props: { containerClass: T.string() },
  render() {
    const { containerClass = "" } = this;
    const baseClass = this.theme("uix-app-shell");

    return html`
      <div
        class=${baseClass + ((containerClass && ` ${containerClass}`) || "")}
      >
        <slot name="top-navbar"></slot>
        <div class=${this.theme("uix-app-shell__content")}>
          <slot name="left-navbar"></slot>
          <main class=${this.theme("uix-app-shell__main")}>
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
const theme = {
  "uix-app-shell": "w-full h-full flex flex-col",
  "uix-app-shell__content": "flex h-full",
  "uix-app-shell__main": "relative content flex-grow overflow-y-auto",
};

export default {
  i18n: {},
  theme,
  views: {
    "uix-app-shell": AppShell,
    "uix-router": Router,
  },
};
