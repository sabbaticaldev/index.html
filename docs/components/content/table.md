# UIX Table Documentation

## Introduction
The `uix-table` component is a versatile table component that supports pagination, custom headers, and dynamic rows. This component is ideal for displaying tabular data in a clean and organized manner.

## API Table

### Properties

#### `uix-table`

| Property         | Type     | Default     | Description                                    |
|------------------|----------|-------------|------------------------------------------------|
| `currentPage`    | `number` | `1`         | The current page of the table.                 |
| `perPage` | `number` | `10`        | The number of rows to display per page.        |

## Theme

### Table

| Class                    | Description                                          |
|--------------------------|------------------------------------------------------|
| `uix-table__container`   | Styles for the table container.                      |
| `uix-table__header-group`| Styles for the table header group.                   |
| `uix-table__header`      | Styles for the table header cells.                   |
| `uix-table__row-group`   | Styles for the table row group.                      |
| `uix-table__row`         | Styles for the table rows.                           |
| `uix-table__cell`        | Styles for the table data cells.                     |

## Examples

### Basic Table
```html
<uix-table count=20>
  <uix-text slot="header">Name</uix-text>
  <uix-text slot="header">Age</uix-text>
  <uix-text slot="header">Occupation</uix-text>
  <uix-table-row>
    <uix-text>John Doe</uix-text>
    <uix-text>28</uix-text>
    <uix-text>Engineer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Jane Smith</uix-text>
    <uix-text>34</uix-text>
    <uix-text>Designer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Sam Green</uix-text>
    <uix-text>45</uix-text>
    <uix-text>Manager</uix-text>
  </uix-table-row>
</uix-table>
```

### Table with Objects as Rows
```html
<uix-table>
  <uix-text slot="header">Name</uix-text>
  <uix-text slot="header">Age</uix-text>
  <uix-text slot="header">Occupation</uix-text>
  <uix-table-row>
    <uix-text>John Doe</uix-text>
    <uix-text>28</uix-text>
    <uix-text>Engineer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Jane Smith</uix-text>
    <uix-text>34</uix-text>
    <uix-text>Designer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Sam Green</uix-text>
    <uix-text>45</uix-text>
    <uix-text>Manager</uix-text>
  </uix-table-row>
</uix-table>
```

### Paginated Table
```html
<uix-table perPage="3">
  <uix-table-row>
    <uix-text>John Doe</uix-text>
    <uix-text>28</uix-text>
    <uix-text>Engineer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Jane Smith</uix-text>
    <uix-text>34</uix-text>
    <uix-text>Designer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Sam Green</uix-text>
    <uix-text>45</uix-text>
    <uix-text>Manager</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Lisa Brown</uix-text>
    <uix-text>29</uix-text>
    <uix-text>Artist</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Paul White</uix-text>
    <uix-text>38</uix-text>
    <uix-text>Photographer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Lucy Black</uix-text>
    <uix-text>41</uix-text>
    <uix-text>Chef</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Jack Blue</uix-text>
    <uix-text>22</uix-text>
    <uix-text>Musician</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Nina Yellow</uix-text>
    <uix-text>36</uix-text>
    <uix-text>Scientist</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Tom Orange</uix-text>
    <uix-text>27</uix-text>
    <uix-text>Writer</uix-text>
  </uix-table-row>
  <uix-table-row>
    <uix-text>Emma Red</uix-text>
    <uix-text>32</uix-text>
    <uix-text>Architect</uix-text>
  </uix-table-row>
  <uix-text slot="header">Name</uix-text>
  <uix-text slot="header">Age</uix-text>
  <uix-text slot="header">Occupation</uix-text>
</uix-table>
```

## Notes
- The `uix-table` component automatically paginates the rows based on the `currentPage` and `perPage` properties.
- Use the `uix-pagination` component to navigate between pages.
- You can pass either arrays of arrays or arrays of objects as the `rows` property. If using objects, the order of the values will follow the order of the `headers`.