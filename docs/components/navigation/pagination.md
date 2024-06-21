# UIX Pagination Documentation

## Introduction
The `uix-pagination` component is used to create a pagination control for navigating through a large set of data split into pages.

## API Table

### Properties

| Property       | Type      | Default     | Description                                         |
|----------------|-----------|-------------|-----------------------------------------------------|
| `totalResults` | `number`  | `0`         | The total number of results to paginate through.    |
| `currentPage`  | `number`  | `1`         | The current page number.                            |
| `perPage` | `number`| `10`        | The number of results per page.                     |
| `onPageChange` | `function`| `null`      | Function to call when the page is changed.          |
| `variant`      | `string`  | `default`   | The visual style variant of the pagination.         |
| `size`         | `string`  | `md`        | The size of the pagination control.                 |

## Examples

### Basic Pagination
```html
<uix-pagination
  totalResults="100"
  currentPage="1"
  perPage="10"
  onPageChange=${(page) => console.log("Page changed to:", page)}
></uix-pagination>
```

### Pagination with Different Variants
```html
<uix-pagination
  totalResults="100"
  currentPage="1"
  perPage="10"
  variant="primary"
  onPageChange=${(page) => console.log("Page changed to:", page)}
></uix-pagination>

<uix-pagination
  totalResults="100"
  currentPage="1"
  perPage="10"
  variant="secondary"
  onPageChange=${(page) => console.log("Page changed to:", page)}
></uix-pagination>
```

### Pagination with Different Sizes
```html
<uix-pagination
  totalResults="100"
  currentPage="1"
  perPage="10"
  size="sm"
  onPageChange=${(page) => console.log("Page changed to:", page)}
></uix-pagination>

<uix-pagination
  totalResults="100"
  currentPage="1"
  perPage="10"
  size="lg"
  onPageChange=${(page) => console.log("Page changed to:", page)}
></uix-pagination>
```