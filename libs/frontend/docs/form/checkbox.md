# Checkbox

The `<uix-checkbox>` component represents a checkbox input control.

## Usage

```html
<uix-checkbox
  name="agree"  
  ?checked=${true}
  ?disabled=${false}
  .change=${(e) => console.log(e.target.checked)}
></uix-checkbox>
```

<uix-checkbox
  name="agree"
  ?checked=${true}  
  ?disabled=${false}
  .change=${(e) => console.log(e.target.checked)}  
></uix-checkbox>

## Properties

| Property   | Type        | Default     | Description                                           |
| ---------- | ----------- | ----------- | ----------------------------------------------------- |
| `name`     | `string`    |             | The name attribute of the checkbox.                   |
| `checked`  | `boolean`   | `false`     | Whether the checkbox is checked.                      |
| `value`    | `boolean`   |             | The value of the checkbox.                            |
| `disabled` | `boolean`   | `false`     | Whether the checkbox is disabled.                     |
| `change`   | `function`  |             | Event handler for when the checkbox state changes.    |
| `variant`  | `string`    | `'default'` | The variant style of the checkbox.                    |
| `size`     | `string`    | `'md'`      | The size of the checkbox.                             |

The checkbox component supports theming and customization through the `variant` and `size` properties.