import { ReactiveView } from "frontend";
import { defaultTheme, html, T } from "frontend";
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

export default ReactiveView.define("app-design-menu", AppDesignMenu);
