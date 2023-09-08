export default {
  tag: 'app-documents',
  name: 'Documents',
  secondary: true,
  icon: 'people-fill',
  onLoad: (host) => {
    const iframe = host.shadowRoot.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        if (
          iframe.contentWindow &&
          typeof iframe.contentWindow.history.pushState === 'function'
        ) {
          // Change the SPA's route without reloading the iframe
          iframe.contentWindow.history.pushState(
            {},
            '',
            '/admin/collections/media'
          );
        }
      });
    }
  },
  render: ({ html }) => html`
    <app-bootstrapp>
      <iframe
        src="http://localhost:4000/admin/index.html"
        title="main content"
        class="h-full w-full"
      ></iframe>
    </app-bootstrapp>
  `,
};

