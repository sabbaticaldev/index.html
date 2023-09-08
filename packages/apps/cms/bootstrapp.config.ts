export default {
  tag: 'app-cms',
  name: 'CMS',
  icon: 'clipboard-fill',
  onLoad: host => {
    const iframe = host.shadowRoot.querySelector('iframe')
    if (iframe) {
      iframe.addEventListener('load', () => {
        if (iframe.contentWindow && typeof iframe.contentWindow.history.pushState === 'function') {
          // Change the SPA's route without reloading the iframe
          iframe.contentWindow.history.pushState({}, '', '/admin/collections/pages/create')
        }
      })
    }
  },
  render: ({ html }) => {
    // create function to reuse here;
    return html`
      <app-bootstrapp>
        <iframe
          src="http://localhost:4000/admin/index.html"
          title="main content"
          class="h-full w-full"
        ></iframe>
      </app-bootstrapp>
    `
  },
}
