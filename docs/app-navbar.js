import { ReactiveView } from "frontend";
import { html } from "frontend";

const sections = await (await fetch("/components.json")).json();

class AppNavbar extends ReactiveView {
  render() {
    return html`
      <uix-container
        width="md"
        height="screen"
        gap="sm"
        padding="sm"
        position="fixed"
        secondary
      >
        <uix-logo logo="/logo.png">
          <uix-text size="sm" weight="semibold">Design System</uix-text>
        </uix-logo>
        <uix-divider></uix-divider>
        ${Object.keys(sections).map(
          (section) => html`<uix-text
              transform="uppercase"
              size="xs"
              icon=${sections[section].icon}
            >
              ${sections[section].label}
            </uix-text>
            <uix-divider></uix-divider>
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
              </uix-container> `,
            )}`,
        )}
      </uix-container>
      <uix-container
        width="md"
        height="screen"
        gap="sm"
        padding="sm"
      ></uix-container>
    `;
  }
}

export default ReactiveView.define("app-navbar", AppNavbar);
