Here is an improved version of the `uix-rating` component to use the `uix-icon` component with "star" and "star-half" icons:

```javascript
import { html, T, genTheme } from "frontend";

const Rating = {
  tag: "uix-rating",
  props: {
    value: T.number({ defaultValue: 0 }),
    max: T.number({ defaultValue: 5 }),
    readonly: T.boolean({ defaultValue: false }),
    change: T.function(),
  },
  _theme: {
    "uix-rating": "flex items-center",
    "uix-rating__star": "w-5 h-5 fill-current text-gray-300",
    "uix-rating__star--filled": "text-yellow-400",
  },
  render() {
    const { value, max, readonly, change } = this;

    return html`
      <uix-container class="uix-rating">
        ${Array.from({ length: max }, (_, index) => {
          const isFilled = index < value;
          const isHalf = index + 0.5 === value;
          return html`
            <uix-icon
              class="uix-rating__star ${isFilled ? 'uix-rating__star--filled' : ''}"
              name=${isHalf ? "star-half" : "star"}
              @click=${() => !readonly && change(index + 1)}
            ></uix-icon>
          `;
        })}
      </uix-container>
    `;
  },
};

export default Rating;
```

# UIX Rating Documentation

## Introduction
The `uix-rating` component allows users to select a rating value by clicking on stars. The component can be configured to be read-only or interactive, and uses icons for filled and half-filled stars.

## API Table

### Properties

| Property  | Type      | Default | Description                                    |
|-----------|-----------|---------|------------------------------------------------|
| `value`   | `number`  | `0`     | The current rating value.                      |
| `max`     | `number`  | `5`     | The maximum number of stars.                   |
| `readonly`| `boolean` | `false` | If `true`, the rating is read-only.            |
| `change`  | `function`| `null`  | Function to call when the rating value changes.|

## Examples

### Basic Rating
```html
<uix-rating></uix-rating>
```
```code
<uix-rating></uix-rating>
```

### Rating with Initial Value
```html
<uix-rating value="3"></uix-rating>
```
```code
<uix-rating value="3"></uix-rating>
```

### Rating with Maximum Value
```html
<uix-rating max="10"></uix-rating>
```
```code
<uix-rating max="10"></uix-rating>
```

### Read-Only Rating
```html
<uix-rating value="4" readonly></uix-rating>
```
```code
<uix-rating value="4" readonly></uix-rating>
```

### Interactive Rating with Change Handler
```html
<uix-rating value="2" @change="${(value) => console.log('New rating:', value)}"></uix-rating>
```
```code
<uix-rating value="2" @change="${(value) => console.log('New rating:', value)}"></uix-rating>
```

## Notes
- The `uix-rating` component is flexible and can be styled using the theme system.
- The `change` event provides the new rating value when a user interacts with the component.
- The `readonly` property makes the rating non-interactive, useful for displaying ratings without allowing changes.

This documentation provides an overview of the `uix-rating` component, its properties, and usage examples. By leveraging these properties, `uix-rating` ensures a consistent and customizable rating system in your application.