# UIX Card Documentation

## Introduction
The `uix-card` component is a versatile container element that can be used to display content with a header, body, and footer. It supports various visual styles, spacing options, and shadow effects.

## API Table

### Properties

#### `uix-card`
| Property  | Type     | Default | Description                                          |
|-----------|----------|---------|------------------------------------------------------|
| `variant` | `string` | `"default"` | The visual style variant of the card (e.g., primary, secondary). |
| `spacing` | `string` | `"md"`   | The spacing inside the card (e.g., xs, sm, md, lg). |
| `shadow`  | `string` | `"default"` | The shadow effect for the card (e.g., none, sm, default, md, lg, xl, 2xl). |

#### `uix-card-header`
| Property  | Type     | Default | Description                                          |
|-----------|----------|---------|------------------------------------------------------|
| `spacing` | `string` | `"md"`   | The spacing inside the card header (e.g., xs, sm, md, lg). |

#### `uix-card-body`
| Property  | Type     | Default | Description                                          |
|-----------|----------|---------|------------------------------------------------------|
| `spacing` | `string` | `"md"`   | The spacing inside the card body (e.g., xs, sm, md, lg). |

#### `uix-card-footer`
| Property  | Type     | Default | Description                                          |
|-----------|----------|---------|------------------------------------------------------|
| `spacing` | `string` | `"md"`   | The spacing inside the card footer (e.g., xs, sm, md, lg). |

## Examples

### Default Card
```html
<uix-card>
  <p>This is a default card.</p>
</uix-card>
```
```code
<uix-card>
  <p>This is a default card.</p>
</uix-card>
```

### Card with Header and Footer
```html
<uix-card>
  <uix-card-header>Card Header</uix-card-header>
  <uix-card-body>
    <p>This is a card with header and footer.</p>
  </uix-card-body>
  <uix-card-footer>Card Footer</uix-card-footer>
</uix-card>
```
```code
<uix-card>
  <uix-card-header>Card Header</uix-card-header>
  <uix-card-body>
    <p>This is a card with header and footer.</p>
  </uix-card-body>
  <uix-card-footer>Card Footer</uix-card-footer>
</uix-card>
```

### Primary Variant Card
```html
<uix-card variant="primary">
  <uix-card-body>
    <p>This is a primary variant card.</p>
  </uix-card-body>
</uix-card>
```
```code
<uix-card variant="primary">
  <uix-card-body>
    <p>This is a primary variant card.</p>
  </uix-card-body>
</uix-card>
```

### Card with Custom Spacing
```html
<uix-card spacing="lg">
  <uix-card-body>
    <p>This is a card with large spacing.</p>
  </uix-card-body>
</uix-card>
```
```code
<uix-card spacing="lg">
  <uix-card-body>
    <p>This is a card with large spacing.</p>
  </uix-card-body>
</uix-card>
```

### Card with Shadow
```html
<uix-card shadow="lg">
  <uix-card-body>
    <p>This is a card with a large shadow.</p>
  </uix-card-body>
</uix-card>
```
```code
<uix-card shadow="lg">
  <uix-card-body>
    <p>This is a card with a large shadow.</p>
  </uix-card-body>
</uix-card>
```
```
