# UIX Table Documentation

## Introduction
The `uix-table` component is a versatile table component that supports pagination, custom headers, and dynamic rows. This component is ideal for displaying tabular data in a clean and organized manner.

## API Table

### Properties

#### `uix-table`

| Property         | Type     | Default     | Description                                    |
|------------------|----------|-------------|------------------------------------------------|
| `headers`        | `array`  | `[]`        | An array of strings representing the table headers. |
| `rows`           | `array`  | `[]`        | An array of arrays or objects representing the table rows. |
| `currentPage`    | `number` | `1`         | The current page of the table.                 |
| `resultsPerPage` | `number` | `10`        | The number of rows to display per page.        |

## Theme

### Table

| Class                    | Description                                          |
|--------------------------|------------------------------------------------------|
| `uix-table__table`       | Styles for the table element.                        |
| `uix-table__header`      | Styles for the table header cells.                   |
| `uix-table__cell`        | Styles for the table data cells.                     |

## Examples

### Basic Table
```html
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[["John Doe", 28, "Engineer"], ["Jane Smith", 34, "Designer"], ["Sam Green", 45, "Manager"]]'
></uix-table>
```
```code
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[["John Doe", 28, "Engineer"], ["Jane Smith", 34, "Designer"], ["Sam Green", 45, "Manager"]]'
></uix-table>
```

### Table with Objects as Rows
```html
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[{"name": "John Doe", "age": 28, "occupation": "Engineer"}, {"name": "Jane Smith", "age": 34, "occupation": "Designer"}, {"name": "Sam Green", "age": 45, "occupation": "Manager"}]'
></uix-table>
```
```code
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[{"name": "John Doe", "age": 28, "occupation": "Engineer"}, {"name": "Jane Smith", "age": 34, "occupation": "Designer"}, {"name": "Sam Green", "age": 45, "occupation": "Manager"}]'
></uix-table>
```

### Paginated Table
```html
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[
    ["John Doe", 28, "Engineer"],
    ["Jane Smith", 34, "Designer"],
    ["Sam Green", 45, "Manager"],
    ["Lisa Brown", 29, "Artist"],
    ["Paul White", 38, "Photographer"],
    ["Lucy Black", 41, "Chef"],
    ["Jack Blue", 22, "Musician"],
    ["Nina Yellow", 36, "Scientist"],
    ["Tom Orange", 27, "Writer"],
    ["Emma Red", 32, "Architect"]
  ]'
  resultsPerPage="5"
></uix-table>
```
```code
<uix-table
  headers='["Name", "Age", "Occupation"]'
  rows='[
    ["John Doe", 28, "Engineer"],
    ["Jane Smith", 34, "Designer"],
    ["Sam Green", 45, "Manager"],
    ["Lisa Brown", 29, "Artist"],
    ["Paul White", 38, "Photographer"],
    ["Lucy Black", 41, "Chef"],
    ["Jack Blue", 22, "Musician"],
    ["Nina Yellow", 36, "Scientist"],
    ["Tom Orange", 27, "Writer"],
    ["Emma Red", 32, "Architect"]
  ]'
  resultsPerPage="5"
></uix-table>
```

## Notes
- The `uix-table` component automatically paginates the rows based on the `currentPage` and `resultsPerPage` properties.
- Use the `uix-pagination` component to navigate between pages.
- You can pass either arrays of arrays or arrays of objects as the `rows` property. If using objects, the order of the values will follow the order of the `headers`.