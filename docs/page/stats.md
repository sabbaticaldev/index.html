# Stats

A component for displaying statistics or metrics in a grid layout.

## Props

| Prop  | Type  | Default | Description                      |
|-------|-------|---------|----------------------------------|
| items | array | []      | An array of stat items to display |

### Stat Item

| Prop  | Type   | Default | Description               |
|-------|--------|---------|---------------------------|
| value | string |         | The value of the stat     |
| label | string |         | The label for the stat    |

## Example

```html
<uix-stats
  :items="[
    { value: '100+', label: 'Customers' },
    { value: '50%', label: 'Growth' },  
    { value: '4.5', label: 'Avg Rating' },
    { value: '$10k', label: 'Revenue' }
  ]"  
></uix-stats>
```

The stats component displays the stat items in a grid. On small screens it shows one item per row, on medium screens it shows two items per row, and on large screens it shows four items per row.

Each stat item displays the value in a large font size and the label below it in a smaller font size. The text is centered within each grid cell.