Here is the updated documentation for the `uix-avatar` component:

# UIX Avatar Documentation

## Introduction
The `uix-avatar` component is used to display user profile pictures or other images in various styles and sizes. The component can be customized to show different variants, sizes, rounded corners, and additional features like presence indicators and border rings.

## API Table

### Properties

#### `uix-avatar`

| Property   | Type      | Default     | Description                                    |
|------------|-----------|-------------|------------------------------------------------|
| `size`     | `string`  | `"md"`      | The size of the avatar (e.g., xs, sm, md, lg, xl, 2xl). |
| `variant`  | `string`  | `"default"` | The visual style variant of the avatar (e.g., primary, secondary, success, danger). |
| `src`      | `string`  | `""`        | The source URL of the avatar image.            |
| `alt`      | `string`  | `""`        | The alt text for the avatar image.             |
| `border`   | `boolean` | `true`      | Whether the avatar should have a border.       |
| `rounded`  | `string`  | `"rounded-full"` | The border radius of the avatar (e.g., rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl). |
| `presence` | `string`  | `""`        | The presence indicator status (e.g., online, offline). |
| `ring`     | `boolean` | `false`     | Whether the avatar should have a border ring.  |

### Functions

| Function | Type       | Default | Description                                   |
|----------|------------|---------|-----------------------------------------------|
| `render` | `function` | `null`  | Renders the avatar component.                 |

## Examples

### Basic Avatar
```html
<uix-avatar src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```
```code
<uix-avatar src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```

### Avatar with Different Sizes
```html
<uix-avatar size="xs" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```
```code
<uix-avatar size="xs" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```

### Avatar with Variants
```html
<uix-avatar variant="primary" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
<uix-avatar variant="secondary" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```
```code
<uix-avatar variant="primary" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
<uix-avatar variant="secondary" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```

### Avatar with Presence Indicator
```html
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" presence="online"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" presence="offline"></uix-avatar>
```
```code
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" presence="online"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" presence="offline"></uix-avatar>
```

### Avatar with Ring
```html
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" ring variant="primary"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" ring variant="secondary"></uix-avatar>
```
```code
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" ring variant="primary"></uix-avatar>
<uix-avatar size="lg" src="https://picsum.photos/200" alt="User Avatar" ring variant="secondary"></uix-avatar>
```

### Square Avatar
```html
<uix-avatar rounded="rounded-none" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```
```code
<uix-avatar rounded="rounded-none" src="https://picsum.photos/200" alt="User Avatar"></uix-avatar>
```