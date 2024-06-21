# UIX Select Documentation

## Introduction

The `uix-select` component is used to create dropdown select elements with various customization options.

## API Table

### Properties

| Property   | Type      | Default     | Description                                      |
|------------|-----------|-------------|--------------------------------------------------|
| `options`  | `array`   | `[]`        | An array of options for the select dropdown.     |
| `value`    | `string`  | `""`        | The selected value of the dropdown.              |
| `variant`  | `string`  | `"default"` | The visual style variant of the select.          |
| `size`     | `string`  | `"md"`      | The size of the select (e.g., sm, md, lg, xl).   |
| `name`     | `string`  | `""`        | The name attribute for the select element.       |

### Functions

| Function  | Type       | Default | Description                                     |
|-----------|------------|---------|-------------------------------------------------|
| `change`  | `function` | `null`  | A function to handle change events on the select.|

## Examples

### Basic Select

```html
<uix-select name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

```code
<uix-select name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

### Select with Different Sizes

```html
<uix-select size="lg" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

```code
<uix-select size="lg" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

### Select with Variants

```html
<uix-select variant="primary" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
<uix-select variant="secondary" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

```code
<uix-select variant="primary" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
<uix-select variant="secondary" name="example" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

### Select with a Default Value

```html
<uix-select name="example" value="option2" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```

```code
<uix-select name="example" value="option2" options='[{ "value": "option1", "label": "Option 1" }, { "value": "option2", "label": "Option 2" }]'></uix-select>
```