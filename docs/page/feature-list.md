# Feature List

A component for displaying a list of features with icons and text.

## Props

| Prop  | Type  | Default | Description                        |
|-------|-------|---------|----------------------------------- |
| items | array | []      | An array of feature items to display |

### Feature Item

| Prop | Type   | Default | Description                 |
|------|--------|---------|---------------------------- |
| icon | string |         | The name of the icon to use |
| text | string |         | The text of the feature     |

## Example

```html
<uix-feature-list
  :items="[
    { icon: 'check', text: 'Feature 1' },
    { icon: 'check', text: 'Feature 2' },
    { icon: 'check', text: 'Feature 3' }
  ]"
></uix-feature-list>
```