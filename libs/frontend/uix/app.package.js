import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      props: { containerClass: T.string() },
      render: function () {
        const { containerClass } = this;
        return html`
          <div
            class=${"app-shell w-full h-full flex flex-col " + containerClass ||
            ""}
          >
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
      render: function () {
        const { routes, currentRoute } = this;
        const routeItem = routes.find((route) => route.path === currentRoute);
        return routeItem
          ? html`${routeItem.component}`
          : html`<uix-block>404: Page not found</uix-block>`;
      },
    },
  },
};
