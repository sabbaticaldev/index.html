# Code

The Code component is used to display code snippets with syntax highlighting.

## Props

| Name       | Type     | Default  | Description                                 |
|------------|----------|----------|---------------------------------------------|
| `code`     | `string` |          | The code snippet to display                 |
| `language` | `string` | `"html"` | The programming language of the code snippet |

## Examples

```html
<uix-code code="const foo = 'bar';" language="javascript"></uix-code>
```

This will display a code snippet with JavaScript syntax highlighting.

## Source Code

Source code for the Code component can be found in `libs/frontend/uix/content/code.js`.