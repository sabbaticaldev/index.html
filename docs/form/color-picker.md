# Color Picker

The `<uix-color-picker>` component allows users to select a color from a predefined set of colors.

## Usage

```html
<uix-color-picker
  .colors=${['red', 'blue', 'green']}
  .selectedColor=${'blue'}
  .colorKey=${'primary'}
  .updateTheme=${(theme) => console.log(theme)}
  .userTheme=${{}}
></uix-color-picker>
```

<uix-color-picker
  .colors=${['red', 'blue', 'green']}
  .selectedColor=${'blue'}
  .colorKey=${'primary'}
  .updateTheme=${(theme) => console.log(theme)}
  .userTheme=${{}}
></uix-color-picker>

## Properties

| Property         | Type       | Default | Description                                                 |
| ---------------- | ---------- | ------- | ----------------------------------------------------------- |
| `colors`         | `array`    | `[]`    | An array of color values to display.                        |
| `selectedColor`  | `string`   |         | The currently selected color.                               |
| `colorKey`       | `string`   |         | The key to use when updating the theme with the color.      |
| `updateTheme`    | `function` |         | A function to update the theme with the selected color.     |
| `userTheme`      | `object`   | `{}`    | The current user theme object.                              |

The color picker component allows customization of the available colors and integrates with a theming system to update the user's theme based on the selected color.