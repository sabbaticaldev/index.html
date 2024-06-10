# Checkbox Group

The `<uix-checkbox-group>` component is used to group multiple checkboxes together.

## Usage

```html
<uix-checkbox-group
  name="fruits"
  .options=${[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' }
  ]}
  .value=${['apple', 'orange']}
  .change=${(e) => console.log(e.target.value)}
></uix-checkbox-group>
```

<uix-checkbox-group
  name="fruits"
  .options=${[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' }
  ]}
  .value=${['apple', 'orange']}
  .change=${(e) => console.log(e.target.value)}
></uix-checkbox-group>

## Properties

| Property   | Type       | Default | Description                                      |
| ---------- | ---------- | ------- | ------------------------------------------------ |
| `name`     | `string`   |         | The name attribute of the checkbox group.        |
| `options`  | `array`    | `[]`    | An array of checkbox options (label and value).  |
| `value`    | `array`    |         | The currently selected checkbox values.          |
| `change`   | `function` |         | Event handler for when the selection changes.    |