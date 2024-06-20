# `uix-range` Documentation

## Introduction
The `uix-range` component is used to capture numeric input from the user via a slider. It supports various customization options such as size, variant, min, max, and step values.

## API Table

### Properties

| Property  | Type      | Default     | Description                                            |
|-----------|-----------|-------------|--------------------------------------------------------|
| `variant` | `string`  | `"default"` | The visual style variant of the range input.           |
| `min`     | `number`  | `0`         | The minimum value of the range.                        |
| `value`   | `array`   | `[0]`       | The current value(s) of the range.                     |
| `max`     | `number`  | `100`       | The maximum value of the range.                        |
| `step`    | `number`  | `1`         | The step increment of the range.                       |
| `size`    | `string`  | `"md"`      | The size of the range input (e.g., sm, md, lg, xl).    |

## Examples

### Basic Range
```html
<uix-range></uix-range>
```
```code
<uix-range></uix-range>
```

### Range with Different Sizes
```html
<uix-range size="sm"></uix-range>
<uix-range size="lg"></uix-range>
```
```code
<uix-range size="sm"></uix-range>
<uix-range size="lg"></uix-range>
```

### Range with Variants
```html
<uix-range variant="primary"></uix-range>
<uix-range variant="secondary"></uix-range>
```
```code
<uix-range variant="primary"></uix-range>
<uix-range variant="secondary"></uix-range>
```

### Range with Custom Min, Max, and Step
```html
<uix-range min="0" max="50" step="5"></uix-range>
```
```code
<uix-range min="0" max="50" step="5"></uix-range>
```

### Double Handle Range
```html
<uix-range value="[10, 40]" max="50"></uix-range>
```
```code
<uix-range value="[10, 40]" max="50"></uix-range>
```

This code and documentation provide a comprehensive overview of the `uix-range` component, including its properties, examples of usage, and details on how to customize it using the `variant` and `size` attributes.