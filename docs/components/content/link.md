# UIX Link Documentation

## Introduction
The `uix-link` component is used to create stylized hyperlinks and buttons with optional icons. It leverages the `uix-text` component to apply text styles and includes various customization options for size, variant, font, and more.

## API Table

### Properties

| Property    | Type       | Default     | Description                                                           |
|-------------|------------|-------------|-----------------------------------------------------------------------|
| `href`      | `string`   | ``          | The URL to navigate to when the link is clicked.                      |
| `onclick`   | `function` | ``          | The function to call when the link is clicked.                        |
| `icon`      | `string`   | ``          | The name of the icon to display alongside the link text.              |
| `size`      | `string`   | `"base"`    | The size of the link text (e.g., xs, sm, base, lg).                   |
| `variant`   | `string`   | `"default"` | The visual style variant of the link.                                 |
| `weight`    | `string`   | `""`        | The font weight of the link text (e.g., thin, normal, bold).          |
| `font`      | `string`   | `"sans"`    | The font family of the link text (e.g., sans, serif, mono).           |
| `align`     | `string`   | ``          | The horizontal alignment of the link text (e.g., left, center, right).|
| `transform` | `string`   | ``          | The text transformation style (e.g., uppercase, lowercase, capitalize).|
| `leading`   | `string`   | ``          | The line-height of the link text (e.g., tight, normal, loose).        |
| `tracking`  | `string`   | ``          | The letter-spacing of the link text (e.g., tighter, normal, wider).   |

## Examples

### Basic Link
```html
<uix-link href="https://example.com">Click Here</uix-link>
```
```code
<uix-link href="https://example.com">Click Here</uix-link>
```

### Link with Icon
```html
<uix-link href="https://example.com" icon="link">Click Here</uix-link>
```
```code
<uix-link href="https://example.com" icon="link">Click Here</uix-link>
```

### Button Link
```html
<uix-link .onclick=\${() => console.log('Button clicked!')}>Click Here</uix-link>
```
```code
<uix-link onclick=${() => console.log('Button clicked!')}>Click Here</uix-link>
```

### Link with Text Customization
```html
<uix-link href="https://example.com" size="lg" variant="primary" weight="bold">Click Here</uix-link>
```
```code
<uix-link href="https://example.com" size="lg" variant="primary" weight="bold">Click Here</uix-link>
```

### Link with Custom Font and Alignment
```html
<uix-link href="https://example.com" font="mono" align="center">Click Here</uix-link>
```
```code
<uix-link href="https://example.com" font="mono" align="center">Click Here</uix-link>
```

## Notes
- The `uix-link` component can render as an anchor (`<a>`) or a button (`<button>`) depending on whether the `href` attribute is provided.
- The `icon` property uses the `uix-icon` component to display an icon alongside the link text.
- The text properties such as `size`, `variant`, `weight`, `font`, `align`, `transform`, `leading`, and `tracking` are passed to the `uix-text` component for consistent text styling.
