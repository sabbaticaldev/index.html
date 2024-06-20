# Form

The Form component is a container for form fields and handles form submission.

## Props

| Prop name | Type | Default value | Description |
| --- | --- | --- | --- |
| `fields` | `array` | `[]` | An array of form field definitions. |
| `actions` | `array` | `[]` | An array of form action definitions, such as submit and reset buttons. |
| `method` | `string` | `"post"` | The HTTP method to use when submitting the form. |
| `endpoint` | `string` | `undefined` | The URL to submit the form to. |
| `llm` | `object` | `undefined` | An optional language model object to assist with form field completion. |

## Examples
