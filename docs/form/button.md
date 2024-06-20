# UIX Button Documentation

## Introduction
The `uix-button` component is a customizable HTML button element that supports various styles, sizes, and behaviors. It is designed for user interfaces that require clickable actions.

## API Table

### Properties

| Property  | Type       | Default     | Description                                                |
|-----------|------------|-------------|------------------------------------------------------------|
| `size`    | `string`   | `"md"`      | The size of the button (e.g., sm, md, lg, xl).             |
| `variant` | `string`   | `"default"` | The visual style variant of the button.                    |
| `type`    | `string`   | `"button"`  | The type attribute of the button (e.g., button, submit).   |
| `href`    | `string`   | `null`      | The URL to navigate to when the button is clicked.         |
| `click`   | `function` | `null`      | A function to handle click events on the button.           |

## Theme Properties

### Sizes

| Size | Description   |
|------|---------------|
| `sm` | Small button  |
| `md` | Medium button |
| `lg` | Large button  |
| `xl` | Extra large button |

### Variants

| Variant    | Description        |
|------------|--------------------|
| `primary`  | Primary button     |
| `secondary`| Secondary button   |
| `success`  | Success button     |
| `danger`   | Danger button      |

## Examples

### Default Button
```html
<uix-button>Default Button</uix-button>
```
```code
<uix-button width="md">Default Button</uix-button>
```

### Primary Button
```html
<uix-button variant="primary">Primary Button</uix-button>
```
```code
<uix-button  width="md" variant="primary">Primary Button</uix-button>
```

### Secondary
```html
<uix-button variant="secondary">Secondary Button</uix-button>
```
```code
<uix-button variant="secondary">Secondary Button</uix-button>
```

### Success Button
```html
<uix-button variant="success">Success Button</uix-button>
```
```code
<uix-button variant="success">Success Button</uix-button>
```

### Danger Button
```html
<uix-button variant="danger">Danger Button</uix-button>
```
```code
<uix-button variant="danger">Danger Button</uix-button>
```


### Icon Button
```html
<uix-button icon="search">Search</uix-button>
<uix-button width="xs" icon="search"></uix-button>
```
```code
<uix-button icon="search">Search</uix-button>
<uix-button width="xs" icon="search"></uix-button>
```


### Small Sized Button
```html
<uix-button size="sm" width="sm">Small Button</uix-button>
```
```code
<uix-button size="sm" width="sm">Small Button</uix-button>
```

### Large Sized Button
```html
<uix-button size="lg" width="lg">Large Button</uix-button>
```
```code
<uix-button size="lg" width="lg">Large Button</uix-button>
```

### Extra Large Sized Button
```html
<uix-button size="2xl" width="xl">Extra Large Button</uix-button>
```
```code
<uix-button size="2xl" width="xl">Extra Large Button</uix-button>
```

### Button with Click Event
```html
<uix-button .onclick="${() => console.log('Button clicked!')}">Click Me</uix-button>
```
```code
<uix-button .onclick=${() => console.log('Button clicked!')}>Click Me</uix-button>
```

### Button with Href
```html
<uix-button href="https://example.com">Go to Example</uix-button>
```
```code
<uix-button href="https://example.com">Go to Example</uix-button>
```