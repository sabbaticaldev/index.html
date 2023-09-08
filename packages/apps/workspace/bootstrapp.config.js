export default {
  tag: 'app-workspace',
  name: 'Workspace',
  index: 1,
  icon: 'chat-square-fill',
  additionalProps: { class: 'xs:hidden md:inline' },
  render: ({ html }) => html`
    <app-bootstrapp>
      <iframe
        src="http://localhost:4000/workspace/index.html"
        title="main content"
        class="h-full w-full"></iframe>
      </div>
    </app-bootstrapp>
  `,
};


