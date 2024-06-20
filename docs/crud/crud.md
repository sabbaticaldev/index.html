# Crud

## Description
The Crud component is a high-level component that composes the other CRUD components to provide a complete CRUD interface.

## Props
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| model     | string     |         | The name of the model                            |
| rows      | array      |         | The array of row data                            |
| fields    | array      |         | Array of field names for the model               |
| setRows   | function   |         | Function to set the rows data                    |
| ModelClass| object     |         | The class definition for the model               |

## Examples
```html
<uix-crud
  model="User"
  .rows=${users}
  .fields=${['name', 'email']}
  .setRows=${setUsers}
  .ModelClass=${User}>
</uix-crud>
```

## Source Code