# UIX File Input Documentation

## Introduction
The `uix-file-input` component is used to create file input fields, allowing users to select files from their device.

## API Table

### Properties

| Property  | Type      | Default     | Description                                   |
|-----------|-----------|-------------|-----------------------------------------------|
| `accept`  | `string`  | `""`        | Specifies the types of files that the server accepts (e.g., ".jpg,.png,.doc"). |
| `multiple`| `boolean` | `false`     | Specifies whether multiple files can be selected.       |
| `variant` | `string`  | `"default"` | The visual style variant of the file input.   |
| `size`    | `string`  | `"md"`      | The size of the file input (e.g., sm, md, lg, xl).      |
| `change`  | `function`| `null`      | Function to handle the change event.          |

## Examples

### Basic File Input
```html
<uix-file-input></uix-file-input>
```

### File Input with Multiple File Selection
```html
<uix-file-input multiple></uix-file-input>
```

### File Input with Accepted File Types
```html
<uix-file-input accept=".jpg,.png,.doc"></uix-file-input>
```

### File Input with Different Sizes
```html
<uix-file-input size="sm"></uix-file-input>
<uix-file-input size="lg"></uix-file-input>
```

### File Input with Variants
```html
<uix-file-input variant="primary"></uix-file-input>
<uix-file-input variant="secondary"></uix-file-input>
```

This setup ensures that the `uix-file-input` component follows a consistent styling and theming approach, similar to the other UI components like `uix-textarea`.