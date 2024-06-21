# UIX radio Documentation

## Introduction
The `uix-radio` component is used to create customizable radio inputs in forms. It supports various sizes and visual style variants.

## API Table

### Properties

#### `uix-radio`

| Property   | Type      | Default     | Description                                    |
|------------|-----------|-------------|------------------------------------------------|
| `name`     | `string`  | `""`        | The name attribute of the radio input.      |
| `variant`  | `string`  | `"default"` | The visual style variant of the radio.      |
| `size`     | `string`  | `"md"`      | The size of the radio (e.g., sm, md, lg).   |
| `checked`  | `boolean` | `false`     | Whether the radio is checked.               |
| `disabled` | `boolean` | `false`     | Whether the radio is disabled.              |
| `change`   | `function`| `null`      | A function to handle change events on the radio. |

## Examples

### Basic radio
```html
<uix-radio name="example" checked></uix-radio>
```
```code
<uix-radio name="example" checked></uix-radio>
```

### radio with Different Sizes
```html
<uix-radio size="xs" name="example" checked></uix-radio>
<uix-radio size="sm" name="example" ></uix-radio>
<uix-radio size="md" name="example" ></uix-radio>
<uix-radio size="lg" name="example" ></uix-radio>
```
```code
<uix-radio size="xs" name="example-xs" checked></uix-radio>
<uix-radio size="sm" name="example-sm" checked></uix-radio>
<uix-radio size="md" name="example-md" checked></uix-radio>
<uix-radio size="lg" name="example-lg" checked></uix-radio>
```

### radio with Variants
```html
<uix-radio variant="primary" name="example-primary" checked></uix-radio>
<uix-radio variant="secondary" name="example-secondary" checked></uix-radio>
<uix-radio variant="success" name="example-primary" checked></uix-radio>
<uix-radio variant="danger" name="example-secondary" checked></uix-radio>
```
```code
<uix-radio variant="primary" name="example-primary" checked></uix-radio>
<uix-radio variant="secondary" name="example-secondary" checked></uix-radio>
<uix-radio variant="success" name="example-primary" checked></uix-radio>
<uix-radio variant="danger" name="example-secondary" checked></uix-radio>
```

### Disabled radio
```html
<uix-radio disabled name="example-disabled"></uix-radio>
```
```code
<uix-radio disabled name="example-disabled" checked></uix-radio>
```

### radio with Change Event
```html
<uix-radio name="example-change" .onchange="${() => console.log('radio changed!')}"></uix-radio>
```
```code
<uix-radio name="example-change" .onchange="${() => console.log('radio changed!')}"></uix-radio>
```

This updated `uix-radio` component now follows the same theme system used in the other components and includes the necessary documentation for easy reference and usage.