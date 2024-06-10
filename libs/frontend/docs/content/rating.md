# Rating

The Rating component allows users to provide a rating or feedback using star icons.

## Props

| Name     | Type     | Default | Description                                                 |
|----------|----------|---------|-------------------------------------------------------------|
| value    | number   | 0       | The current rating value.                                   |
| max      | number   | 5       | The maximum rating value.                                   |
| readonly | boolean  | false   | Determines if the rating is read-only or interactive.       |
| change   | function | -       | Callback function triggered when the rating value changes.  |

## Examples

### Basic Usage

```html
<uix-rating value="3"></uix-rating>
```

### Read-only Rating

```html
<uix-rating value="4" readonly></uix-rating>
```

## Source Code

The source code for the Rating component can be found at [libs/frontend/uix/content/rating.js](../uix/content/rating.js).