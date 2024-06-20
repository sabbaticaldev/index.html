# UIX Text Documentation

## Introduction
The `uix-text` component is used to display stylized text with various customization options. It supports different sizes, variants, fonts, alignments, and other text properties to provide a consistent and flexible way to style text in your application.

## API Table

### Properties

| Property     | Type      | Default     | Description                                                                 |
|--------------|-----------|-------------|-----------------------------------------------------------------------------|
| `size`       | `string`  | `"base"`    | The size of the text (e.g., xs, sm, base, lg, xl).                          |
| `variant`    | `string`  | `"default"` | The visual style variant of the text.                                       |
| `weight`     | `string`  | `""`        | The font weight of the text (e.g., thin, light, normal, semibold, bold).    |
| `font`       | `string`  | `"sans"`    | The font family of the text (e.g., sans, serif, mono).                      |
| `align`      | `string`  | `undefined` | The horizontal alignment of the text (e.g., left, center, right, justify).  |
| `transform`  | `string`  | `undefined` | The text transformation style (e.g., uppercase, lowercase, capitalize).     |
| `leading`    | `string`  | `undefined` | The line-height of the text (e.g., tight, normal, loose).                   |
| `tracking`   | `string`  | `undefined` | The letter-spacing of the text (e.g., tighter, normal, wider).              |
| `icon`       | `string`  | `undefined` | The name of the icon to display alongside the text.                         |

### Functions

| Function | Type       | Default | Description                                   |
|----------|------------|---------|-----------------------------------------------|
| `render` | `function` | `null`  | Renders the text component.                   |

## Examples

### Basic Text
```html
<uix-text>This is a basic text</uix-text>
```
```code
<uix-text>This is a basic text</uix-text>
```

### Text with Different Sizes
```html
<uix-text size="sm">Small Text</uix-text>
<uix-text size="lg">Large Text</uix-text>
```
```code
<uix-text size="sm">Small Text</uix-text>
<uix-text size="lg">Large Text</uix-text>
```

### Text with Variants
```html
<uix-text variant="primary">Primary Text</uix-text>
<uix-text variant="secondary">Secondary Text</uix-text>
```
```code
<uix-text variant="primary">Primary Text</uix-text>
<uix-text variant="secondary">Secondary Text</uix-text>
```

### Text with Font Weight and Font Family
```html
<uix-text weight="bold" font="serif">Bold Serif Text</uix-text>
<uix-text weight="light" font="mono">Light Mono Text</uix-text>
```
```code
<uix-text weight="bold" font="serif">Bold Serif Text</uix-text>
<uix-text weight="light" font="mono">Light Mono Text</uix-text>
```

### Text with Alignment and Transformation
```html
<uix-text align="center" transform="uppercase">Centered Uppercase Text</uix-text>
```
```code
<uix-text align="center" transform="uppercase">Centered Uppercase Text</uix-text>
```

### Text with Icon
```html
<uix-text icon="check-circle">Text with Icon</uix-text>
```
```code
<uix-text icon="check-circle">Text with Icon</uix-text>
```

## Notes
- The `uix-text` component can render an icon alongside the text if the `icon` property is provided.
- The text properties such as `size`, `variant`, `weight`, `font`, `align`, `transform`, `leading`, and `tracking` are customizable to ensure consistent and flexible text styling.
- The `variant` property uses predefined text colors which can be customized using the `defaultTheme` object.
