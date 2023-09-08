export default {
  tag: "app-container",
  controller: "task",
  render: ({ html }) => {
    return html`
      <div class="h-full w-full">
        <app-sidebar></app-sidebar>
        <div class="lg:pl-72 h-full">
          <app-topbar></app-topbar>
          <app-context-menu></app-context-menu>

          <main class="h-full w-full">
            <div class="h-full w-full">
              <slot></slot>
            </div>
          </main>
        </div>
      </div>
    `;
  },
};
