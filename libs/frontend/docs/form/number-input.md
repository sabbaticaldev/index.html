# Number Input

The `<uix-number-input>` component represents an input field for entering numeric values.

## Usage

```html
<uix-number-input
  .value=${10}
  min="0"
  max="100"
  step="1"
  .change=${(e) => console.log(e.target.value)}
></uix-number-input>
```

<uix-number-input
  .value=${10}
  min="0"
  max="100"
  step="1"
  .change=${(e) => console.log(e.target.value)}
></uix-number-input>

## Properties

| Property | Type       | Default | Description                                         |
| -------- | ---------- | ------- | --------------------------------------------------- |
| `value`  | `number`   |         | The current numeric value.                          |
| `min`    | `number`   |         | The minimum allowed value.                          |
| `max`    | `number`   |         | The maximum allowed value.                          |
| `step`   | `number`   |         | The step increment for the value.                   |
| `change` | `function` |         | Event handler for when the value changes.           |

The number input component allows users to enter numeric values within a specified range and provides an event handler for reacting to changes in the value.