//TODO: Refactor to use unified DIFF

export default {
  contextSrc: ["libs/frontend"],
  refactoringFiles:
    "uix/layout, navigation frontend files affected by the change",
  taskPrompt:
    `  
    We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
    
    let's create uix-navbar component that will have a list of links and it will mark the selected link in a different. The component below uses uix-accordion to create a navbar, we can do similar:

    

  ` +
    "\r\nexport default {\r\n  i18n: {},\r\n  ...sharedPackage,\r\n  views: {\r\n    ...sharedPackage.views,\r\n    \"app-page\": {\r\n      tag: \"app-page\",\r\n      props: {\r\n        currentRoute: T.string({\r\n          sync: \"url\",\r\n        }),\r\n        routes: T.array(),\r\n        accordion: T.array(),\r\n      },\r\n      connectedCallback: function () {\r\n        const generateSections = () => {\r\n          return Object.entries(sections).map(\r\n            ([sectionKey, sectionComponents]) => {\r\n              const sectionLabel =\r\n                sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);\r\n              const components = Object.entries(sectionComponents).map(\r\n                ([componentKey, component]) => ({\r\n                  path: [sectionKey, componentKey].join(\"-\"),\r\n                  component: this.renderActiveSection(component),\r\n                  label: component.label,\r\n                  sectionLabel,\r\n                  listItem: html`<uix-link\r\n                    size=\"sm\"\r\n                    .onclick=${(e) => {\r\n                      e.preventDefault();\r\n                      this.setCurrentRoute(\r\n                        [sectionKey, componentKey].join(\"-\"),\r\n                      );\r\n                    }}\r\n                  >\r\n                    ${component.label}\r\n                  </uix-link>`,\r\n                }),\r\n              );\r\n              return {\r\n                label: sectionKey,\r\n                content: html`<uix-list vertical\r\n                  >${components.map((c) => c.listItem)}</uix-list\r\n                >`,\r\n                components,\r\n              };\r\n            },\r\n          );\r\n        };\r\n        const sectionsData = generateSections();\r\n\r\n        this.setAccordion(\r\n          sectionsData.map((section) => ({\r\n            label: section.label,\r\n            content: section.content,\r\n            open: true,\r\n          })),\r\n        );\r\n\r\n        this.setRoutes(\r\n          sectionsData.map((section) => section.components).flat(),\r\n        );\r\n      },\r\n      render: function () {\r\n        const { routes, accordion } = this;\r\n        return html`\r\n          <uix-container>\r\n            <uix-text size=\"4xl\">Design System</uix-text>\r\n            <uix-divider></uix-divider>\r\n            <uix-list>\r\n              <uix-container width=\"md\" secondary>\r\n                <uix-accordion\r\n                  width=\"96\"\r\n                  multiple\r\n                  .items=${accordion}\r\n                ></uix-accordion>\r\n              </uix-container>\r\n              <uix-container>\r\n                <uix-router\r\n                  .routes=${routes}\r\n                  currentRoute=${this.currentRoute || \"typography-typography\"}\r\n                  data-theme=\"app-design__router\"\r\n                ></uix-router>\r\n              </uix-container>\r\n              <app-design-menu></app-design-menu>\r\n            </uix-list>\r\n          </uix-container>\r\n        `;\r\n      },\r\n      setCurrentRoute(route) {\r\n        this.currentRoute = route;\r\n      },\r\n",

  responseFormat: "xml",
  strategy: "diff",
};

/* IGNORE THIS COMMENT BLOCK:
Always use best practices when coding.
Respect and use existing conventions, libraries, etc that are already present in the code base.

Take requests for changes to the supplied code.
If the request is ambiguous, ask questions.

  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.

  we have a boilerplate code of a spacer element for the UI kit but no implementation, go ahead and implement it for us

  ========================

  We created a task runner/CLI that interacts with LLMs to refactor code. For now the system is based on a full file refactoring.

  to apply the changes from the LLM we implemented a git diff logic. Let's refactor it to just use simple unified diff for it

  in the response remove extra spaces and indentation, we will run eslint after so removing th spaces can save us some tokens which is very important but most important, DONT MAKE UNNECESSARY CHANGES!

  */
