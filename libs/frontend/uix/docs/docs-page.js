import { html, T } from "helpers";

const formattedTitle = (title) => title.toLowerCase().replace(/ /g, "-");

const renderExamples = (examples) =>
  examples.map(
    (example) => html`
      <section id="${formattedTitle(example.title)}">
        <uix-block>
          <uix-text size="4">${example.title}</uix-text>
          <p>${example.description}</p>
        </uix-block>
        <uix-block>${example.codeComponent}</uix-block>
        <uix-block
          ><uix-mockup-code code=${example.code}></uix-mockup-code
        ></uix-block>
      </section>
    `,
  );

const renderContents = (examples) => html`
  <ul>
    <li><a href="#description">Description</a></li>
    <li><a href="#properties">Properties</a></li>
    <li><a href="#examples">Examples</a></li>
    ${examples.map(
    (example) =>
        html`<li>
          <a href="#${formattedTitle(example.title)}">${example.title}</a>
        </li>`,
    )}
    <li><a href="#source-code">Source Code</a></li>
  </ul>
`;

export default {
  props: {
    title: T.string(),
    description: T.string(),
    tableData: T.array(),
    examples: T.array(),
  },
  theme: {
    "uix-docs-page__container": "flex-grow",
    "uix-docs-page__contents": "w-1/4 lg:w-1/3 xl:w-1/3",
  },
  render() {
    return html`
      <uix-list layout="responsive">
        <uix-block class=${this.theme("uix-docs-page__container")}>
          <uix-block>
            <uix-text size="2">${this.title}</uix-text>
            <p>${this.description}</p>
          </uix-block>
          <uix-block>
            <uix-table
              .headers=${["Type", "Property", "Description", "Lit Property?"]}
              .rows=${this.tableData}
            ></uix-table>
          </uix-block>
          <uix-divider></uix-divider>
          ${renderExamples(this.examples)}
        </uix-block>
        <uix-block class=${this.theme("uix-docs-page__contents")}>
          <uix-text size="4">Contents</uix-text>
          ${renderContents(this.examples)}
        </uix-block>
      </uix-list>
    `;
  },
};