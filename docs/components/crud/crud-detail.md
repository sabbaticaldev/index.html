# CrudDetail

## Description
The CrudDetail component displays the details of a single item and provides options to edit or delete it.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| item      | object     |         | The item to display details for                  |
| fields    | array      |         | Array of field names to display                  |
| editItem  | function   |         | Function to handle editing the item              |
| deleteItem| function   |         | Function to handle deleting the item             |

## Examples
```html
<uix-crud-detail
  .item=${selectedUser}
  .fields=${['name', 'email']}
  .editItem=${editUser}
  .deleteItem=${deleteUser}>
</uix-crud-detail>
```

## Source Code