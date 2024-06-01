import { html, T } from "helpers";

const ColorPicker = {
  tag: "uix-color-picker",
  props: {
    selectedColor: T.string(),
    colors: T.array({ defaultValue: [] }),
    colorKey: T.string(),
    updateTheme: T.function(),
    userTheme: T.object(),
  },
  theme: ({ generateColorClass, ColorPickerClasses = [] }) => ({
    "uix-color-picker": "grid grid-cols-14",
    "uix-color-picker__colors": ColorPickerClasses.flat().join(" "),
    "uix-color-picker__color-block": ({ selectedColor }) =>
      `group relative w-6 h-6 cursor-pointer ${
        selectedColor
          ? "scale-110"
          : "hover:scale-110 transform transition ease-out duration-150"
      }`,
    "uix-color-picker__color": ({ color }) =>
      `w-6 h-6 block ${generateColorClass(color, 500)}`,
    "uix-color-picker__shades-container":
      "absolute left-0 mt-1 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto",
    "uix-color-picker__shade": ({ color, shade }) =>
      `w-6 h-6 block ${generateColorClass(color, shade * 100)}`,
  }),
  render() {
    return html`
      ${this.colors.map(
        (color) => html`
          <div
            class=${this.theme("uix-color-picker__color-block", {
              selectedColor: this.selectedColor === color,
            })}
          >
            <span
              @click=${() =>
                this.updateTheme({
                  ...this.userTheme,
                  colors: {
                    ...this.baseTheme.colors,
                    [this.colorKey]: color,
                  },
                })}
              class=${this.theme("uix-color-picker__color", { color })}
            ></span>
            <div class=${this.theme("uix-color-picker__shades-container")}>
              ${Array.from({ length: 9 }, (_, i) => i + 1).map(
                (shade) => html`
                  <span
                    @click=${() =>
                      this.updateTheme({
                        ...this.userTheme,
                        colors: {
                          ...this.baseTheme.colors,
                          [this.colorKey]: color,
                        },
                      })}
                    class=${this.theme("uix-color-picker__shade", {
                      color,
                      shade,
                    })}
                  ></span>
                `,
              )}
            </div>
          </div>
        `,
      )}
    `;
  },
};

export default ColorPicker;
