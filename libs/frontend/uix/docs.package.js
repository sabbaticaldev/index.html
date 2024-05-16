import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

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
        const { title, description, tableData, examples } = this;
        const formattedTitle = (title) =>
          title.toLowerCase().replace(/ /g, "-");

        return html`
          <uix-list layout="responsive">
            <uix-block class="flex-grow">
              <uix-block>
                <uix-text size="2">${title}</uix-text>
                <p>${description}</p>
              </uix-block>
              <uix-block>
                <uix-table
                  .headers=${[
    "Type",
    "Property",
    "Description",
    "Lit Property?",
  ]}
                  .rows=${tableData}
                ></uix-table>
              </uix-block>
              <uix-divider></uix-divider>
              ${examples.map(
    (example) => html`
                  <section id="${formattedTitle(example.title)}">
                    <uix-block>
                      <uix-text size="4">${example.title}</uix-text>
                      <p>${example.description}</p>
                    </uix-block>
                    <uix-block> ${example.codeComponent} </uix-block>
                    <uix-block>
                      <uix-mockup-code code=${example.code}></uix-mockup-code>
                    </uix-block>
                  </section>
                `,
  )}
            </uix-block>

            <uix-block class="w-1/4 lg:w-1/3 xl:w-1/3">
              <uix-text size="4">Contents</uix-text>
              <ul>
                <li><a href="#description">Description</a></li>
                <li><a href="#properties">Properties</a></li>
                <li><a href="#examples">Examples</a></li>
                ${examples.map(
    (example) => html`
                    <li>
                      <a href="#${formattedTitle(example.title)}"
                        >${example.title}</a
                      >
                    </li>
                  `,
  )}
                <li><a href="#source-code">Source Code</a></li>
              </ul>
            </uix-block>
          </uix-list>
        `;
      },
    },
  },
};
