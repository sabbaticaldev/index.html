

# `uix-textarea` Documentation

## Introduction
The `uix-textarea` component is used to capture multi-line text input from the user. It supports various customization options such as size, variant, placeholder text, and more.

## API Table

### Properties

| Property      | Type      | Default     | Description                                             |
|---------------|-----------|-------------|---------------------------------------------------------|
| `value`       | `string`  | `""`        | The value of the textarea.                              |
| `placeholder` | `string`  | `""`        | Placeholder text for the textarea.                      |
| `name`        | `string`  | `""`        | Name attribute for the textarea.                        |
| `disabled`    | `boolean` | `false`     | Disables the textarea.                                  |
| `required`    | `boolean` | `false`     | Marks the textarea as required.                         |
| `autofocus`   | `boolean` | `false`     | Automatically focuses the textarea on page load.        |
| `rows`        | `number`  | `4`         | Number of rows for the textarea.                        |
| `variant`     | `string`  | `"default"` | The visual style variant of the textarea.               |
| `size`        | `string`  | `"md"`      | The size of the textarea (e.g., sm, md, lg, xl).        |
| `input`       | `function`| `null`      | Function to handle input events.                        |
| `keydown`     | `function`| `null`      | Function to handle keydown events.                      |

## Examples

### Basic Textarea
```html
<uix-textarea placeholder="Enter your text here"></uix-textarea>
```
```code
<uix-textarea placeholder="Enter your text here"></uix-textarea>
```

### Textarea with Different Sizes
```html
<uix-textarea size="sm" placeholder="Small Textarea"></uix-textarea>
<uix-textarea size="lg" placeholder="Large Textarea"></uix-textarea>
```
```code
<uix-textarea size="sm" placeholder="Small Textarea"></uix-textarea>
<uix-textarea size="lg" placeholder="Large Textarea"></uix-textarea>
```

### Textarea with Variants
```html
<uix-textarea variant="primary" placeholder="Primary Variant"></uix-textarea>
<uix-textarea variant="secondary" placeholder="Secondary Variant"></uix-textarea>
```
```code
<uix-textarea variant="primary" placeholder="Primary Variant"></uix-textarea>
<uix-textarea variant="secondary" placeholder="Secondary Variant"></uix-textarea>
```

### Disabled Textarea
```html
<uix-textarea placeholder="Disabled Textarea" disabled></uix-textarea>
```
```code
<uix-textarea placeholder="Disabled Textarea" disabled></uix-textarea>
```

### Required Textarea
```html
<uix-textarea placeholder="Required Textarea" required></uix-textarea>
```
```code
<uix-textarea placeholder="Required Textarea" required></uix-textarea>
```

### Textarea with Input Event
```html
<uix-textarea placeholder="Textarea with Input Event" @input="${() => console.log('Input event!')}"></uix-textarea>
```
```code
<uix-textarea placeholder="Textarea with Input Event" @input="${() => console.log('Input event!')}"></uix-textarea>
```