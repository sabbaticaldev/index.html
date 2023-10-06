import {
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {    
    "uix-docs-page": {
      props: {
        title: { type: String, defaultValue: "" },
        description: { type: String, defaultValue: "" },
        tableData: { type: Array, defaultValue: [] },
        examples: { type: Array, defaultValue: [] },
      },
      render: ({ title, description, tableData, examples }, { html }) => {
  
        const formattedTitle = (title) => title.toLowerCase().replace(/ /g, "-");
  
        return html`
              <uix-list layout="responsive">
                  <uix-block class="flex-grow">
                    <uix-block>    
                      <uix-heading size="2">${title}</uix-heading>
                      <p>${description}</p>
                      </uix-block>
                      <uix-block>
                          <uix-table
                              .headers=${["Type", "Property", "Description", "Lit Property?"]}
                              .rows=${tableData}
                          ></uix-table>
                      </uix-block>
                      <uix-divider></uix-divider>
                      ${examples.map((example) => html`
                          <section id="${formattedTitle(example.title)}">
                            <uix-block>    
                              <uix-heading size="4">${example.title}</uix-heading>
                              <p>${example.description}</p>
                            </uix-block>
                            <uix-block>
                              ${example.codeComponent}
                            </uix-block>
                            <uix-block>        
                              <uix-mockup-code code=${example.code}></uix-mockup-code>
                            </uix-block>        
                          </section>
                      `)}
                  </uix-block>
                  
                  <uix-block class="w-1/4 lg:w-1/3 xl:w-1/3">
                      <uix-heading size="4">Contents</uix-heading>
                      <ul>
                          <li><a href="#description">Description</a></li>
                          <li><a href="#properties">Properties</a></li>
                          <li><a href="#examples">Examples</a></li>
                          ${examples.map((example) => html`
                              <li>
                                  <a href="#${formattedTitle(example.title)}">${example.title}</a>
                              </li>
                          `)}
                          <li><a href="#source-code">Source Code</a></li>
                      </ul>
                  </uix-block>
              </uix-list>
          `;
      },
    },
  }
};
      