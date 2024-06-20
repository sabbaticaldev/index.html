# UIX Avatar Group Documentation

## Introduction
The `uix-avatar-group` component is used to display a group of avatars together, overlapping them in a visually appealing way. It also supports showing a count of additional avatars that are not displayed.

## API Table

### Properties

#### `uix-avatar-group`

| Property | Type     | Default | Description                                    |
|----------|----------|---------|------------------------------------------------|
| `count`  | `number` | `null`  | The total number of avatars, used to show additional count. |

### Functions

| Function | Type       | Default | Description                                      |
|----------|------------|---------|--------------------------------------------------|
| `render` | `function` | `null`  | Renders the avatar group component.              |

## Examples

### Basic Avatar Group
```html
<uix-avatar-group count="5">
  <uix-avatar src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```
```code
<uix-avatar-group count="5">
  <uix-avatar src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```

### Avatar Group with More Count
```html
<uix-avatar-group count="7">
  <uix-avatar src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```
```code
<uix-avatar-group count="7">
  <uix-avatar src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```

### Avatar Group with Custom Styles
```html
<uix-avatar-group count="4">
  <uix-avatar variant="primary" ring src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar variant="secondary" ring src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar variant="success" ring src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```
```code
<uix-avatar-group count="4">
  <uix-avatar variant="primary" src="https://picsum.photos/200?1" alt="User Avatar 1"></uix-avatar>
  <uix-avatar variant="secondary" src="https://picsum.photos/200?2" alt="User Avatar 2"></uix-avatar>
  <uix-avatar variant="success" src="https://picsum.photos/200?3" alt="User Avatar 3"></uix-avatar>
</uix-avatar-group>
```
