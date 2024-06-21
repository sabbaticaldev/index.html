# Footer

A component for displaying a page footer with copyright text and links.

## Props

| Prop      | Type   | Default | Description                         |
|-----------|--------|---------|-------------------------------------|
| copyright | string |         | The copyright text to display        |
| links     | array  | []      | An array of links to display in the footer |

### Link Item

| Prop | Type   | Default | Description          |
|------|--------|---------|----------------------|
| text | string |         | The text of the link |
| href | string |         | The URL of the link  |

## Example

```html
<uix-footer
  copyright="© 2023 My Company"
  :links="[
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms of Service', href: '/terms' }
  ]"
></uix-footer>
```