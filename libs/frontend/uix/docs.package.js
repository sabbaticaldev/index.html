import { html, T } from "helpers";


const formattedTitle = (title) => title.toLowerCase().replace(/ /g, "-");

const renderExamples = (examples) => examples.map(example => html`
  <section id="${formattedTitle(example.title)}">
    <uix-block>
      <uix-text size="4">${example.title}</uix-text>
      <p>${example.description}</p>
    </uix-block>
    <uix-block>${example.codeComponent}</uix-block>
    <uix-block><uix-mockup-code code=${example.code}></uix-mockup-code></uix-block>
  </section>
`);

const renderContents = (examples) => html`
  <ul>
    <li><a href="#description">Description</a></li>
    <li><a href="#properties">Properties</a></li>
    <li><a href="#examples">Examples</a></li>
    ${examples.map(example => html`<li><a href="#${formattedTitle(example.title)}">${example.title}</a></li>`)}
    <li><a href="#source-code">Source Code</a></li>
  </ul>
`;

export default {
  i18n: {},
  views: {
    "uix-docs-page": {
      props: {
        title: T.string(),
        description: T.string(),
        tableData: T.array(),
        examples: T.array(),
      },
      render: function () {
        return html`
          <uix-list layout="responsive">
            <uix-block class="flex-grow">
              <uix-block>
                <uix-text size="2">${this.title}</uix-text>
                <p>${this.description}</p>
              </uix-block>
              <uix-block>
                <uix-table .headers=${["Type", "Property", "Description", "Lit Property?"]} .rows=${this.tableData}></uix-table>
              </uix-block>
              <uix-divider></uix-divider>
              ${renderExamples(this.examples)}
            </uix-block>

            <uix-block class="w-1/4 lg:w-1/3 xl:w-1/3">
              <uix-text size="4">Contents</uix-text>
              ${renderContents(this.examples)}
            </uix-block>
          </uix-list>
        `;
      },
    },
  },
};
