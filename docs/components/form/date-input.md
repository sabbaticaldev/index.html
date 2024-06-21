# `uix-date-input` Documentation

## Introduction
The `uix-date-input` component is used to capture date input from the user. It supports various customization options such as size, variant, min, max, and value.

## API Table

### Properties

| Property  | Type      | Default     | Description                                            |
|-----------|-----------|-------------|--------------------------------------------------------|
| `value`   | `string`  | `""`        | The current value of the date input.                   |
| `min`     | `string`  | `""`        | The minimum value of the date input.                   |
| `max`     | `string`  | `""`        | The maximum value of the date input.                   |
| `variant` | `string`  | `"default"` | The visual style variant of the date input.            |
| `size`    | `string`  | `"md"`      | The size of the date input (e.g., sm, md, lg, xl).     |
| `change`  | `function`| `null`      | Function to handle the change event on the date input. |

## Examples

### Basic Date Input
```html
<uix-date-input></uix-date-input>
```
```code
<uix-date-input></uix-date-input>
```

### Date Input with Different Sizes
```html
<uix-date-input size="sm"></uix-date-input>
<uix-date-input size="lg"></uix-date-input>
```
```code
<uix-date-input size="sm"></uix-date-input>
<uix-date-input size="lg"></uix-date-input>
```

### Date Input with Variants
```html
<uix-date-input variant="primary"></uix-date-input>
<uix-date-input variant="secondary"></uix-date-input>
```
```code
<uix-date-input variant="primary"></uix-date-input>
<uix-date-input variant="secondary"></uix-date-input>
```

### Date Input with Custom Min and Max
```html
<uix-date-input min="2023-01-01" max="2023-12-31"></uix-date-input>
```
```code
<uix-date-input min="2023-01-01" max="2023-12-31"></uix-date-input>
```

This code and documentation provide a comprehensive overview of the `uix-date-input` component, including its properties, examples of usage, and details on how to customize it using the `variant` and `size` attributes.