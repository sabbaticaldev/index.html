# Hero

A component for displaying a hero section with a title, subtitle, and call-to-action button.

## Props

| Prop        | Type     | Default | Description                                 |
|-------------|----------|---------|---------------------------------------------|
| title       | string   |         | The main title of the hero section           |
| subtitle    | string   |         | The subtitle or description of the hero section |
| buttonText  | string   |         | The text to display on the call-to-action button |
| buttonClick | function |         | The click handler for the call-to-action button |

## Example

```html
<uix-hero
  title="Welcome to My App"
  subtitle="The best app ever created!"
  buttonText="Get Started"
  :buttonClick="() => { alert('CTA clicked!'); }"
></uix-hero>
```

The hero component takes up the full width of its container and has a vertical layout with the title, subtitle, and button stacked on top of each other. The background color is a light gray.