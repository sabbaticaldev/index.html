# UIX Input Documentation

## Introduction
The `uix-input` component is a HTML input element wrapper that supports various input types and customization options. It is designed to be used in forms and user interfaces where user input is required. 

API TAble, properties, examples
## API Table

### Properties

| Property     | Type       | Default     | Description                                                 |
|--------------|------------|-------------|-------------------------------------------------------------|
| `autofocus`  | `boolean`  | `false`     | Automatically focus the input when the page loads.          |
| `value`      | `string`   | `""`        | The initial value of the input.                             |
| `placeholder`| `string`   | `""`        | The placeholder text displayed in the input.                |
| `name`       | `string`   | `""`        | The name attribute of the input.                            |
| `disabled`   | `boolean`  | `false`     | Disable the input, preventing user interaction.             |
| `regex`      | `string`   | `""`        | A regex pattern that the input's value must match.          |
| `required`   | `boolean`  | `false`     | Mark the input as required for form submission.             |
| `type`       | `string`   | `"text"`    | The type of input (e.g., text, password, email).            |
| `maxLength`  | `number`   | `null`      | The maximum number of characters allowed in the input.      |
| `variant`    | `string`   | `"default"` | The visual style variant of the input.                      |
| `size`       | `string`   | `"md"`      | The size of the input (e.g., sm, md, lg).                   |

### Functions

| Function     | Type       | Default     | Description                                                 |
|--------------|------------|-------------|-------------------------------------------------------------|
| `keydown`    | `function` | `null`      | A function to handle keydown events on the input.           |


## Examples

### Default Input
```html
<uix-input placeholder="Default Input"></uix-input>
```
```code
<uix-input placeholder="Default Input"></uix-input>
```

### Password Input
```html
<uix-input placeholder="Password Input" type="password"></uix-input>
```
```code
<uix-input placeholder="Password Input" type="password"></uix-input>
```

### Email Input
```html
<uix-input placeholder="Email Input" type="email"></uix-input>
```
```code
<uix-input placeholder="Email Input" type="email"></uix-input>
```

### Number Input
```html
<uix-input placeholder="Number Input" type="number"></uix-input>
```
```code
<uix-input placeholder="Number Input" type="number"></uix-input>
```

### Disabled Input
```html
<uix-input placeholder="Disabled Input" disabled></uix-input>
```
```code
<uix-input placeholder="Disabled Input" disabled></uix-input>
```

### Required Input
```html
<uix-input placeholder="Required Input" required></uix-input>
```
```code
<uix-input placeholder="Required Input" required></uix-input>
```

### Input with Keydown Event
```html
<uix-input placeholder="Keydown Event" @keydown="${() => console.log('Key pressed!')}"></uix-input>
```
```code
<uix-input placeholder="Keydown Event" @keydown="${() => console.log('Key pressed!')}"></uix-input>
```

### Large Sized Input
```html
<uix-input placeholder="Large Size Input" size="lg"></uix-input>
```
```code
<uix-input placeholder="Large Size Input" size="lg"></uix-input>
```

### Small Sized Input
```html
<uix-input placeholder="Small Size Input" size="sm"></uix-input>
```
```code
<uix-input placeholder="Small Size Input" size="sm"></uix-input>
```

### Input with Custom Variant
```html
<uix-input placeholder="Custom Variant Input" variant="custom"></uix-input>
```
```code
<uix-input placeholder="Custom Variant Input" variant="custom"></uix-input>
```

### Decimal Input
```html
<uix-input placeholder="Decimal Input" type="decimal"></uix-input>
```
```code
<uix-input placeholder="Decimal Input" type="decimal"></uix-input>
```

### Input with Filled Style
```html
<uix-input placeholder="Filled Input" type="text" class="filled"></uix-input>
```
```code
<uix-input placeholder="Filled Input" type="text" class="filled"></uix-input>
```
