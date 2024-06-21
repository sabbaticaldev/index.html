# UIX Search Input Documentation

## Introduction

The `uix-search` component is a versatile search input field that allows users to search and display a list of matching results. It supports customization through various properties and integrates with modern web and HTML features for an enhanced user experience.

## API Table

### Properties

| Property     | Type       | Default      | Description                                      |
|--------------|------------|--------------|--------------------------------------------------|
| `placeholder`| `string`   | `"Search..."`| The placeholder text displayed in the input.     |
| `search`     | `function` | `null`       | The function to handle search input events.      |
| `variant`    | `string`   | `"default"`  | The visual style variant of the search input.    |
| `size`       | `string`   | `"md"`       | The size of the search input (e.g., xs, sm, md). |
| `results`    | `array`    | `[]`         | The list of search results to display.           |

## Examples

### Basic Search Input
```html
<uix-search></uix-search>
```
```code
<uix-search></uix-search>
```

### Search Input with Placeholder
```html
<uix-search placeholder="Type to search..."></uix-search>
```
```code
<uix-search placeholder="Type to search..."></uix-search>
```

### Search Input with Custom Styles
```html
<uix-search variant="primary" size="lg"></uix-search>
```
```code
<uix-search variant="primary" size="lg"></uix-search>
```

### Search Input with Results
```html
<uix-search 
  placeholder="Search for items..." 
  results='["Item 1", "Item 2", "Item 3"]'
></uix-search>
```
```code
<uix-search 
  placeholder="Search for items..." 
  results=${["Item 1", "Item 2", "Item 3"]}
></uix-search>
```
