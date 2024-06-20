# CrudTable

## Description
The CrudTable component displays a table of CRUD data with pagination.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| rows      | array      |         | The array of row data to display                 |
| fields    | object     |         | Object mapping field names to display labels     |

## Examples
```html
<uix-crud-table
  .rows=${users}
  .fields=${{ name: "Name", email: "Email" }}>
</uix-crud-table>
```

## Source Code