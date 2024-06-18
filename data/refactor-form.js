export default {
  projectPath: "https://github.com/sabbaticaldev/test-project.git",
  contextSrc: "libs/frontend",
  taskPrompt: `
  We are creating a UI library based on Lit framework. We created our own format to create those components as you can se in the apps/design files and uix/ files.
  we are refactoring the form components, lets review their current implementation, fix possible errors, add common features and mainly, add a good look and feel to the components using tailwind and following the current class implementation

  Dont import lit-css, use class and the theme object to add style (tailwind classes)
  example:

  import { html, T } from "frontend";

export default {
  tag: "uix-color-picker",
  props: {
    selectedColor: T.string(),
    colors: T.array({ defaultValue: [] }),
    colorKey: T.string(),
    updateTheme: T.function(),
    userTheme: T.object(),
  },

  theme: ({ generateColorClass }) => ({
    "uix-color-picker": "grid grid-cols-14",
    "uix-color-picker__color-block": ({ selectedColor }) =>
      \`group relative w-6 h-6 cursor-pointer \${
        selectedColor
          ? "scale-110"
          : "hover:scale-110 transform transition ease-out duration-150"
      }\`,
    "uix-color-picker__color": ({ color }) =>
      \`w-6 h-6 block \${generateColorClass(color, 500)}\`,
    "uix-color-picker__shades-container":
      "absolute left-0 mt-1 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto",
    "uix-color-picker__shade": ({ color, shade }) =>
      \`w-6 h-6 block \${generateColorClass(color, shade * 100)}\`,
  }),
  render() {
    return html\`
      \${this.colors.map(
        (color) => html\`
          <div class="uix-color-picker__color-block">
            <span
              @click=\${() =>
                this.updateTheme({
                  ...this.userTheme,
                  colors: {
                    ...this.userTheme.colors,
                    [this.colorKey]: color,
                  },
                })}
              class="uix-color-picker__color"
              data-color=\${color}
            ></span>
            <div class="uix-color-picker__shades-container">
              \${Array.from({ length: 9 }, (_, i) => i + 1).map(
                (shade) => html\`
                  <span
                    @click=\${() =>
                      this.updateTheme({
                        ...this.userTheme,
                        colors: {
                          ...this.userTheme.colors,
                          [this.colorKey]: color,
                        },
                      })}
                    class="uix-color-picker__shade"
                    data-shade=\${shade}
                    data-color=\${color}
                  >
                  </span>
                \`,
              )}
            </div>
          </div>
        \`,
      )}
    \`;
  },
};

 `,
};
