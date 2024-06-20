# UIX Divider Documentation

## Introduction
The `uix-divider` component is used to visually separate content with a horizontal line. It can optionally include a label in the center of the divider. This component is highly customizable with various padding options.

## API Table

### Properties

#### `uix-divider`

| Property | Type     | Default | Description                                     |
|----------|----------|---------|-------------------------------------------------|
| `label`  | `string` | `""`    | The label text to display in the center of the divider. |
| `padding`| `string` | `"md"`  | The padding size around the divider (e.g., xs, sm, md, lg). |

### Functions

| Function | Type       | Default | Description                                    |
|----------|------------|---------|------------------------------------------------|
| `render` | `function` | `null`  | Renders the divider component.                 |

## Examples

### Basic Divider
```html
<uix-divider></uix-divider>
```
```code
<uix-divider></uix-divider>
```

### Divider with Label
```html
<uix-divider label="Section Title"></uix-divider>
```
```code
<uix-divider label="Section Title"></uix-divider>
```

### Divider with Different Padding
```html
<uix-divider label="Section Title" padding="lg"></uix-divider>
```
```code
<uix-divider label="Section Title" padding="lg"></uix-divider>
```

## Detailed Example

### Divider with All Properties
```html
<uix-divider label="More Information" padding="xl"></uix-divider>
```
```code
<uix-divider label="More Information" padding="xl"></uix-divider>
```

### Usage in a Container
```html
<uix-container>
  <p>Some content above the divider.</p>
  <uix-divider label="Divider Label" padding="lg"></uix-divider>
  <p>Some content below the divider.</p>
</uix-container>
```
```code
<uix-container>
  <p>Some content above the divider.</p>
  <uix-divider label="Divider Label" padding="lg"></uix-divider>
  <p>Some content below the divider.</p>
</uix-container>
```
