# File Input

The `<uix-file-input>` component represents an input field for selecting files.

## Usage

```html
<uix-file-input
  accept=".pdf,.doc"
  ?multiple=${true}
  .change=${(e) => console.log(e.target.files)}
></uix-file-input>
```

<uix-file-input
  accept=".pdf,.doc"
  ?multiple=${true}
  .change=${(e) => console.log(e.target.files)}
></uix-file-input>

## Properties

| Property   | Type       | Default | Description                                          |
| ---------- | ---------- | ------- | ---------------------------------------------------- |
| `accept`   | `string`   |         | The accepted file types (e.g., ".pdf,.doc").         |
| `multiple` | `boolean`  | `false` | Whether multiple file selection is allowed.          |
| `change`   | `function` |         | Event handler for when the selected files change.    |

The file input component allows users to select one or multiple files of specified types and provides an event handler for reacting to changes in the selected files.