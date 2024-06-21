# UIX Badge Documentation

## Introduction
The `uix-badge` component is used to display a badge with customizable size, variant, and optional icon.

## API Table

### Properties

| Property  | Type     | Default     | Description                                   |
|-----------|----------|-------------|-----------------------------------------------|
| `size`    | `string` | `"xs"`      | The size of the badge (e.g., xs, sm, md, lg). |
| `variant` | `string` | `"default"` | The visual style variant of the badge.        |
| `icon`    | `string` | `null`      | The optional icon to display in the badge.    |

## Examples

### Basic Badge
```html
<uix-badge>Basic Badge</uix-badge>
```
```code
<uix-badge>Basic Badge</uix-badge>
```

### Badge with Different Sizes
```html
<uix-badge size="sm">Small Badge</uix-badge>
<uix-badge size="lg">Large Badge</uix-badge>
```
```code
<uix-badge size="sm">Small Badge</uix-badge>
<uix-badge size="lg">Large Badge</uix-badge>
```

### Badge with Variants
```html
<uix-badge variant="primary">Primary Badge</uix-badge>
<uix-badge variant="secondary">Secondary Badge</uix-badge>
```
```code
<uix-badge variant="primary">Primary Badge</uix-badge>
<uix-badge variant="secondary">Secondary Badge</uix-badge>
```

### Badge with Icon
```html
<uix-badge icon="check">Success Badge</uix-badge>
```
```code
<uix-badge icon="check">Success Badge</uix-badge>
```


### Badge only with Icon
```html
<uix-badge icon="check"></uix-badge>
```
```code
<uix-badge icon="check"></uix-badge>
```
