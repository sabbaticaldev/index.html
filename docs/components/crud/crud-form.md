# CrudForm

## Description
The CrudForm component provides a form for creating or editing an item.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| item      | object     |         | The item to edit (for editing existing item)     |
| fields    | array      |         | Array of field names for the form                |
| saveItem  | function   |         | Function to handle saving the item               |
| cancelEdit| function   |         | Function to handle cancelling the edit           |

## Examples
```html
<uix-crud-form
  .item=${selectedUser}
  .fields=${['name', 'email']}
  .saveItem=${saveUser}
  .cancelEdit=${cancelEdit}>
</uix-crud-form>
```

## Source Code