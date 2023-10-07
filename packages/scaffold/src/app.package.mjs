export default {
  i18n: {},
  views: {
    'uix-router': {
      props: {
        routes: {
          type: Array,
          defaultValue: [],
        },
        currentRoute: {
          type: String,
          defaultValue: '',
        },
      },
      render: ({ routes, currentRoute }, { html }) => {
        // Find the matching route component, if not find
        const routeItem = routes.find((route) => route.path === currentRoute);

        // Render the matched component, or show a default 404 message
        return routeItem
          ? html`${routeItem.component}`
          : html`<uix-block>404: Page not found</uix-block>`;
      },
    },
  },
};
