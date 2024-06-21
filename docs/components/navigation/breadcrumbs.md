# UIX Breadcrumb Documentation

## Introduction
The `uix-breadcrumbs` component is used to display a navigational breadcrumb. It wraps around `uix-link` and `uix-text` components to create breadcrumb items.

## API Table

### `uix-breadcrumbs`

#### Properties

| Property | Type      | Default  | Description                        |
|----------|-----------|----------|------------------------------------|
| `variant` | `string`  | `"default"` | The variant of the breadcrumb (e.g., default, bordered, background, rounded, shadow, large, small). |

## Examples

### Default Breadcrumb
```html
<uix-breadcrumbs>
  <uix-link href="/">Home</uix-link>
  <uix-text>›</uix-text>
  <uix-link href="/library">Library</uix-link>
  <uix-text>›</uix-text>
  <uix-text>Data</uix-text>
</uix-breadcrumbs>
```

### Bordered Breadcrumb
```html
<uix-breadcrumbs variant="bordered">
  <uix-link href="/">Home</uix-link>
  <uix-text>›</uix-text>
  <uix-link href="/library">Library</uix-link>
  <uix-text>›</uix-text>
  <uix-text>Data</uix-text>
</uix-breadcrumbs>
```

### Breadcrumb with Background
```html
<uix-breadcrumbs variant="background">
  <uix-link href="/">Home</uix-link>
  <uix-text>›</uix-text>
  <uix-link href="/library">Library</uix-link>
  <uix-text>›</uix-text>
  <uix-text>Data</uix-text>
</uix-breadcrumbs>
```

### Breadcrumb with Icons
```html
<uix-breadcrumbs>
  <uix-link href="/" icon="home">Home</uix-link>
  <uix-text>›</uix-text>
  <uix-link href="/library" icon="book">Library</uix-link>
  <uix-text>›</uix-text>
  <uix-text icon="database">Data</uix-text>
</uix-breadcrumbs>
```

## Notes
- The `uix-breadcrumbs` component is used to wrap around multiple `uix-link` and `uix-text` components.
- Each `uix-link` can be customized with labels, icons, active state, URLs, and variants.
- The separator (`›`) is automatically added between breadcrumb items using `uix-text`.