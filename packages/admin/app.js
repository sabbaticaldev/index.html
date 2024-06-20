import "/uix/layout/accordion.js";
import "/uix/layout/accordion-item.js";
import "/uix/layout/card.js";
import "/uix/layout/container.js";
import "/uix/layout/divider.js";
import "/uix/form/range.js";
import "/uix/form/button.js";
import "/uix/content/text.js";
import "/uix/content/link.js";

import { ReactiveView } from "frontend";
import { defaultTheme, escapeHTML, html, T, unsafeHTML } from "frontend";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const commonColors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "rose",
  "blue-gray",
];

const greyColors = ["gray", "zinc", "true-gray", "warm-gray", "blue-gray"];

const sections = [
  {
    label: "UI Kit",
    icon: "box",
    items: [
      {
        label: "layout",
        icon: "layout",
        variant: "accordion",
        items: [
          {
            label: "accordion",
            icon: "chevrons-right",
            href: "/design/layout--accordion",
          },
          { label: "card", icon: "credit-card", href: "/design/layout--card" },
          {
            label: "container",
            icon: "box",
            href: "/design/layout--container",
          },
          { label: "divider", icon: "minus", href: "/design/layout--divider" },
        ],
      },
    ],
  },
];

const renderer = new marked.Renderer();
renderer.code = function (code) {
  if (code.lang === "html")
    return `<uix-container horizontal gap="lg" padding="md" justify="evenly" items="center">${code?.text}</uix-container>`;
  return `<pre><code>${escapeHTML(code?.text)}</code></pre>`;
};

class AppIndex extends ReactiveView {
  static properties = {
    design: T.string({ sync: "url" }),
    markdown: T.string(),
  };

  loadMarkdown() {
    const componentPath = this.design.split("--");
    if (!componentPath.length === 2) return;
    fetch(`/${componentPath.join("/")}.md`).then((response) => {
      import(["/uix", ...componentPath].join("/") + ".js").then(() => {
        ReactiveView.unoRuntime();
        ReactiveView.install(true);
        if (response.ok) {
          response.text().then((markdown) => {
            this.markdown = markdown;
          });
        }
      });
    });
  }
  willUpdate(updatedProperties) {
    if (
      updatedProperties.has("design") &&
      updatedProperties.get("design") !== this.design
    ) {
      this.loadMarkdown();
      return true;
    }
    return false;
  }
  render() {
    const { markdown = "" } = this;
    return html`
      <uix-container>
        <uix-text size="4xl">Design System</uix-text>
        <uix-divider></uix-divider>
        <uix-container horizontal>
          <uix-container
            width="md"
            height="screen"
            gap="sm"
            padding="sm"
            secondary
          >
            ${Object.keys(sections).map(
              (section) => html`<uix-text
                  transform="uppercase"
                  size="xs"
                  icon=${sections[section].icon}
                  >${sections[section].label}</uix-text
                >
                ${sections[section].items.map(
                  (category) => html`<uix-container padding="xs">
                    <uix-accordion>
                      <uix-accordion-item
                        label=${category.label}
                        icon=${category.icon}
                      >
                        <uix-container padding="xs">
                          ${category.items.map(
                            (component) =>
                              html`<uix-link
                                icon=${component.icon}
                                href=${component.href}
                                >${component.label}</uix-link
                              >`,
                          )}
                        </uix-container>
                      </uix-accordion-item>
                    </uix-accordion>
                  </uix-container>`,
                )}`,
            )}
          </uix-container>
          <uix-container grow padding="md">
            ${unsafeHTML(marked(markdown, { renderer }))}
          </uix-container>
          <app-design-menu></app-design-menu>
        </uix-container>
      </uix-container>
    `;
  }
}

ReactiveView.define("app-index", AppIndex);

class AppDesignMenu extends ReactiveView {
  static properties = {
    design: T.string({ sync: "url" }),
    userTheme: T.object({ defaultValue: defaultTheme }),
  };

  updateTheme(theme) {
    this.userTheme = theme;
  }
  render() {
    const { userTheme = defaultTheme, setUserTheme } = this;
    return html`
      <uix-container horizontal padding="lg" width="xl">
        <uix-card>
          <uix-container gap="md" padding="lg" class="app-design-menu">
            <uix-text weight="medium" size="3xl"> Theme </uix-text>
            <section>
              <uix-text weight="medium" size="xl">Primary color</uix-text>
              <uix-color-picker
                .selectedColor=${defaultTheme.colors.primary}
                .colors=${commonColors}
                colorKey="primary"
                .updateTheme=${(theme) => this.updateTheme(theme)}
                .userTheme=${userTheme}
              ></uix-color-picker>
            </section>
            <section>
              <uix-text weight="medium" size="xl">Secondary color</uix-text>
              <uix-color-picker
                .selectedColor=${defaultTheme.colors.secondary}
                .colors=${commonColors}
                colorKey="secondary"
                .updateTheme=${(theme) => this.updateTheme(theme)}
                .userTheme=${userTheme}
              ></uix-color-picker>
            </section>
            <section>
              <uix-text weight="medium" size="xl">Gray color</uix-text>
              <uix-color-picker
                .selectedColor=${defaultTheme.colors.grey}
                .colors=${greyColors}
                colorKey="default"
                .updateTheme=${(theme) => this.updateTheme(theme)}
                .userTheme=${userTheme}
              ></uix-color-picker>
            </section>
            <section>
              <uix-text weight="medium" size="xl">Border</uix-text>
              <uix-range
                variant="accent"
                max="8"
                value=${2}
                .change=${(value) => {
                  const newTheme = { ...userTheme, borderRadius: value };
                  setUserTheme(newTheme);
                  setTimeout(() => {
                    this.updateTheme(newTheme);
                  }, 0);
                }}
              ></uix-range>
            </section>
            <section>
              <uix-text weight="medium" size="xl">Scaling</uix-text>
              <uix-container horizontal gap="md">
                ${["90%", "95%", "100%", "105%", "110%"].map(
                  (scale) =>
                    html`
                      <uix-button size="xs" width="xs">${scale}</uix-button>
                    `,
                )}
              </uix-container>
            </section>
            <footer>
              <uix-button
                variant="primary"
                icon="edit"
                @click=${this.changeDesign}
              >
                Save
              </uix-button>
            </footer>
          </uix-container>
        </uix-card>
      </uix-container>
    `;
  }
}

ReactiveView.define("app-design-menu", AppDesignMenu);

export default { title: "UIX Design System" };
