# UIX Modal Documentation

## Introduction
The `uix-modal` component is a versatile and customizable modal dialog box. It allows you to display content in a pop-up dialog, with support for different sizes, variants, and a customizable header.

## API Table

### Properties

| Property  | Type      | Default   | Description                                   |
|-----------|-----------|-----------|-----------------------------------------------|
| `size`    | `string`  | `"md"`    | The size of the modal. Options: `sm`, `md`, `lg`, `xl`. |
| `open`    | `boolean` | `false`   | Whether the modal is open.                    |
| `variant` | `string`  | `"default"` | The visual style of the modal. Options: `default`, `primary`, `secondary`. |
| `label`   | `string`  | `""`      | The label/title of the modal.                 |
| `icon`    | `string`  | `""`      | The icon to be displayed in the modal header. |

### Functions

| Function   | Type       | Description                        |
|------------|------------|------------------------------------|
| `toggle`   | `function` | Toggles the modal's visibility.    |

## Examples

### Basic Modal
```html
<uix-modal label="Basic Modal" size="md">
  <uix-link slot="cta">Open Modal</uix-link>
  <p>This is the content of the modal.</p>
</uix-modal>
```

### Modal with Different Variants
```html
<uix-modal label="Primary Modal" variant="primary" size="lg">
  <uix-link slot="cta">Open Primary Modal</uix-link>
  <p>This is a primary variant modal.</p>
</uix-modal>

<uix-modal label="Secondary Modal" variant="secondary" size="lg">
  <uix-link slot="cta">Open Secondary Modal</uix-link>
  <p>This is a secondary variant modal.</p>
</uix-modal>
```

### Modal with Custom Header
```html
<uix-modal label="Custom Header Modal" icon="info">
  <uix-link slot="cta">Open Modal</uix-link>
  <p>This modal has a custom header with an icon.</p>
</uix-modal>
```

### Large Modal with Form
```html
<uix-modal label="Form Modal" size="xl">
  <uix-link slot="cta">Open Form Modal</uix-link>
  <form>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    <button type="submit">Submit</button>
  </form>
</uix-modal>
```

### Code Explanation
The `uix-modal` component can be customized using various properties such as `size`, `variant`, `label`, and `icon`. The modal content is provided through the default slot. The slot named `cta` is used to trigger the opening of the modal.

When the modal is open, clicking outside the modal content area or clicking the close button in the header will close the modal.

The component uses a `<dialog>` element for the modal, with styles applied to ensure proper appearance and functionality.
