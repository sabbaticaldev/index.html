# UIX Checkbox Documentation

## Introduction
The `uix-checkbox` component is used to create customizable checkbox inputs in forms. It supports various sizes and visual style variants.

## API Table

### Properties

#### `uix-checkbox`

| Property   | Type      | Default     | Description                                    |
|------------|-----------|-------------|------------------------------------------------|
| `name`     | `string`  | `""`        | The name attribute of the checkbox input.      |
| `variant`  | `string`  | `"default"` | The visual style variant of the checkbox.      |
| `size`     | `string`  | `"md"`      | The size of the checkbox (e.g., sm, md, lg).   |
| `checked`  | `boolean` | `false`     | Whether the checkbox is checked.               |
| `disabled` | `boolean` | `false`     | Whether the checkbox is disabled.              |
| `change`   | `function`| `null`      | A function to handle change events on the checkbox. |

## Examples

### Basic Checkbox
```html
<uix-checkbox name="example" checked></uix-checkbox>
```
```code
<uix-checkbox name="example" checked></uix-checkbox>
```

### Checkbox with Different Sizes
```html
<uix-checkbox size="xs" name="example" checked></uix-checkbox>
<uix-checkbox size="sm" name="example" checked></uix-checkbox>
<uix-checkbox size="md" name="example" checked></uix-checkbox>
<uix-checkbox size="lg" name="example" checked></uix-checkbox>
```
```code
<uix-checkbox size="xs" name="example-xs" checked></uix-checkbox>
<uix-checkbox size="sm" name="example-sm" checked></uix-checkbox>
<uix-checkbox size="md" name="example-md" checked></uix-checkbox>
<uix-checkbox size="lg" name="example-lg" checked></uix-checkbox>
```

### Checkbox with Variants
```html
<uix-checkbox variant="primary" name="example-primary" checked></uix-checkbox>
<uix-checkbox variant="secondary" name="example-secondary" checked></uix-checkbox>
<uix-checkbox variant="success" name="example-primary" checked></uix-checkbox>
<uix-checkbox variant="danger" name="example-secondary" checked></uix-checkbox>
```
```code
<uix-checkbox variant="primary" name="example-primary" checked></uix-checkbox>
<uix-checkbox variant="secondary" name="example-secondary" checked></uix-checkbox>
<uix-checkbox variant="success" name="example-primary" checked></uix-checkbox>
<uix-checkbox variant="danger" name="example-secondary" checked></uix-checkbox>
```

### Disabled Checkbox
```html
<uix-checkbox disabled name="example-disabled"></uix-checkbox>
```
```code
<uix-checkbox disabled name="example-disabled" checked></uix-checkbox>
```

### Checkbox with Change Event
```html
<uix-checkbox name="example-change" .onchange="${() => console.log('Checkbox changed!')}"></uix-checkbox>
```
```code
<uix-checkbox name="example-change" .onchange="${() => console.log('Checkbox changed!')}"></uix-checkbox>
```

This updated `uix-checkbox` component now follows the same theme system used in the other components and includes the necessary documentation for easy reference and usage.