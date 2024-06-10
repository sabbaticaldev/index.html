# Link

The Link component is used to create hyperlinks to other pages or sections within the current page.

## Props

| Name      | Type     | Default | Description                                                 |
|-----------|----------|---------|-------------------------------------------------------------|
| `href`    | `string` |         | The URL or path to link to.                                 |
| `onclick` | `func`   |         | Function to be called when the link is clicked.             |
| `size`    | `string` | `"md"`  | The size of the link text.                                  |
| `variant` | `string` |         | The color variant of the link.                              |
| `weight`  | `string` |         | The font weight of the link text.                           |
| `font`    | `string` | `"sans"`| The font family of the link text.                           |
| `leading` | `string` |         | The line height of the link text.                           |

## Examples

```html
<uix-link href="/about" size="lg" variant="primary">About Us</uix-link>
```

Source code: [link.js](../uix/content/link.js)