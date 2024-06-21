# UIX CRUD Documentation

## Introduction
The `uix-crud` component is a versatile CRUD (Create, Read, Update, Delete) interface that integrates with the `uix-table` component for displaying and managing data. It supports dynamic fields and interactions with an API for data operations.

## API Table

### Properties

#### `uix-crud`

| Property | Type     | Default | Description                        |
|----------|----------|---------|------------------------------------|
| `model`  | `string` | `""`    | The name of the model to manage.   |

## Theme

### CRUD

| Class                | Description                                         |
|----------------------|-----------------------------------------------------|
| `uix-crud__actions`  | Styles for the actions container.                   |
| `uix-crud__table`    | Styles for the table container.                     |

## Examples

### Basic CRUD
```html
<uix-crud model="crud"></uix-crud>
```

## Notes
- The `uix-crud` component automatically fetches the model's schema and rows on initialization.
- It uses `uix-table` to display data and integrates with `uix-crud-search` and `uix-crud-actions` for search and action functionalities.
- The CRUD operations (`addRow`, `updateRow`, `deleteRow`) interact with the specified API endpoints for data management.