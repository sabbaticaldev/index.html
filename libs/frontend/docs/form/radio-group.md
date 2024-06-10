# Radio Group

The `<uix-radio-group>` component is used to group multiple radio buttons together.

## Usage

```html
<uix-radio-group
  name="color"
  .options=${[
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' }
  ]}
  .value=${'blue'}
  .change=${(e) => console.log(e.target.value)}
></uix-radio-group>
```

<uix-radio-group
  name="color"
  .options=${[
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' }
  ]}
  .value=${'blue'}
  .change=${(e) => console.log(e.target.value)}
></uix-radio-group>

## Properties

| Property   | Type       | Default | Description                                      |
| ---------- | ---------- | ------- | ------------------------------------------------ |
| `name`     | `string`   |         | The name attribute of the radio group.           |
| `options`  | `array`    | `[]`    | An array of radio options (label and value).     |
| `value`    | `object`   |         | The currently selected radio value.              |
| `change`   | `function` |         | Event handler for when the selection changes.    |