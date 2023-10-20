import T from "bootstrapp-shared";
import { html } from "lit";

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      render: () => {
        return html`
          <div class="app-shell w-full h-full flex flex-col">
            <slot name="top-navbar"></slot>
            <div class="flex h-full">
              <slot name="left-navbar"></slot>
              <main class="relative content flex-grow overflow-y-auto">
                <slot></slot>
              </main>
              <slot name="right-navbar"></slot>
            </div>
            <slot name="bottom-navbar"></slot>
          </div>
        `;
      },
    },
    "uix-router": {
      props: {
        routes: T.array(),
        currentRoute: T.string(),
      },
      render: ({ routes, currentRoute }) => {
        const routeItem = routes.find((route) => route.path === currentRoute);
        return routeItem
          ? html`${routeItem.component}`
          : html`<uix-block>404: Page not found</uix-block>`;
      },
    },
  },
};
