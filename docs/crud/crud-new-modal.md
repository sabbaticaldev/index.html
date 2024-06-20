# CrudNewModal

## Description
The CrudNewModal component provides a modal dialog for creating a new item.

## Props 
| Name      | Type       | Default | Description                                      |
|-----------|------------|---------|--------------------------------------------------|
| fields    | array      |         | Array of field definitions for the form          |
| addRow    | function   |         | Function to handle adding the new row            |
| model     | string     |         | The name of the model                            |
| icon      | string     |         | Icon to display on the "New" button              |

## Examples
```html
<uix-crud-new-modal
  .fields=${userFields}
  .addRow=${addUser}
  model="User"
  icon="plus">
</uix-crud-new-modal>
```

## Source Code