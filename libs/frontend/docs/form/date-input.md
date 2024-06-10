# Date Input

The `<uix-date-input>` component represents an input field for selecting a date.

## Usage

```html
<uix-date-input
  .value=${'2023-06-10'}
  min="2023-01-01"
  max="2023-12-31"
  .change=${(e) => console.log(e.target.value)}
></uix-date-input>
```

<uix-date-input
  .value=${'2023-06-10'}
  min="2023-01-01"
  max="2023-12-31"
  .change=${(e) => console.log(e.target.value)}
></uix-date-input>

## Properties

| Property | Type       | Default | Description                                        |
| -------- | ---------- | ------- | -------------------------------------------------- |
| `value`  | `string`   |         | The currently selected date value.                 |
| `min`    | `string`   |         | The minimum selectable date.                       |
| `max`    | `string`   |         | The maximum selectable date.                       |
| `change` | `function` |         | Event handler for when the selected date changes.  |

The date input component allows users to select a date within a specified range and provides an event handler for reacting to changes in the selected date.
