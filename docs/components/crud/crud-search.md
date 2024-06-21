# CrudSearch

## Description
The CrudSearch component provides a search input for filtering CRUD data.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| setRows   | function   |         | Function to set the filtered rows                |
| model     | string     |         | The name of the model                            |

## Examples
```html
<uix-crud-search
  .setRows=${setFilteredUsers}
  model="User">
</uix-crud-search>
```

## Source Code