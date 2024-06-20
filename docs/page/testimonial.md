# Testimonial

A component for displaying a testimonial or quote with the author's name.

## Props

| Prop   | Type   | Default | Description                |
|--------|--------|---------|----------------------------|
| quote  | string |         | The text of the testimonial or quote |
| author | string |         | The name of the author of the quote |

## Example

```html
<uix-testimonial
  quote="This product is amazing! It has completely transformed my workflow."
  author="John Smith"
></uix-testimonial>  
```

The testimonial component displays the quote text in a larger font size with margins below for spacing. The author name is displayed below the quote in a bold font.

The entire testimonial is displayed inside a card component, giving it a border and subtle shadow effect.