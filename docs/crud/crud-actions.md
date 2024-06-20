# CrudActions

## Description
The CrudActions component provides a set of action buttons for performing CRUD operations.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| setRows   | function   |         | Function to set the rows data                    |
| model     | string     |         | The name of the model                            |
| fields    | array      |         | Array of field names for the model               |
| ModelClass| object     |         | The class definition for the model               |
| rows      | array      |         | The array of row data                            |

## Examples
```html
<uix-crud-actions 
  .setRows=${setRows}
  model="User"
  .fields=${['name', 'email']}
  .ModelClass=${User}
  .rows=${users}>
</uix-crud-actions>
```

## Source Code