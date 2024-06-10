# Avatar

The Avatar component displays a user's avatar image.

## Props

| Name         | Type     | Default   | Description                                 |
|--------------|----------|-----------|---------------------------------------------|
| `src`        | `string` | -         | The URL of the avatar image.               |
| `alt`        | `string` | `""`      | Alternative text for the avatar image.     |
| `size`       | `string` | `"sm"`    | The size of the avatar. Can be "sm", "md", or "lg". |
| `placeholder`| `string` | `""`      | Placeholder text to display if no image is provided. |

## Examples

```html
<uix-avatar src="user.jpg" alt="User Avatar"></uix-avatar>
```

```html
<uix-avatar size="lg" placeholder="JD"></uix-avatar>
```

## Source Code

The source code for the Avatar component can be found at:
`libs/frontend/uix/content/avatar.js`