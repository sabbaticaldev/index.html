# Range

The `<uix-range>` component represents a range slider input control.

## Usage

```html
<uix-range
  min="0"
  max="100"
  step="1"
  .value=${[25, 75]}
></uix-range>
```

<uix-range
  min="0"
  max="100"
  step="1"
  .value=${[25, 75]}
></uix-range>

## Properties

| Property  | Type     | Default     | Description                                 |
| --------- | -------- | ----------- | ------------------------------------------- |
| `min`     | `number` | `0`         | The minimum value of the range.             |
| `max`     | `number` | `100`       | The maximum value of the range.             |
| `step`    | `number` | `1`         | The step increment of the range.            |
| `value`   | `array`  | `[0]`       | The current value(s) of the range.          |
| `variant` | `string` |             | The variant style of the range.             |

The range component allows users to select a value or a range of values by sliding a handle along a track. It supports single or multiple handles and provides customization options through the `variant` property.

Note: When using multiple handles (`value` is an array with two elements), the range will display two handles and highlight the selected range between them.

