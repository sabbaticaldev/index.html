# Date Picker

The Date Picker component provides an input field with a dropdown calendar for selecting a date. It supports minimum and maximum date restrictions and allows customizing the selected date.

## Props

| Name     | Type       | Default | Description                                         |
| -------- | ---------- | ------- | --------------------------------------------------- |
| `value`  | `string`   | -       | The currently selected date in ISO format (YYYY-MM-DD) |
| `min`    | `string`   | -       | The minimum selectable date in ISO format (YYYY-MM-DD) |
| `max`    | `string`   | -       | The maximum selectable date in ISO format (YYYY-MM-DD) |
| `change` | `function` | -       | Callback function triggered when the selected date changes |

## Examples

```html
<uix-date-picker value="2023-06-15"></uix-date-picker>
<uix-date-picker value="2023-12-01" min="2023-01-01" max="2023-12-31"></uix-date-picker>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-date-picker",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    change: T.function(),
  },
  theme: {
    "uix-date-picker": "relative",
    "uix-date-picker__input": "w-full",
    "uix-date-picker__calendar": "absolute mt-1 z-10",
  },
  render() {
    return html`
      <uix-input
        type="text"
        .value=${this.value}
        class="uix-date-picker__input"
        @focus=${() => this.setOpen(true)}
      ></uix-input>
      ${this.open &&
      html`
        <div class="uix-date-picker__calendar">
          <uix-calendar
            .value=${this.value}
            .min=${this.min}
            .max=${this.max}
            .change=${this.change}
          ></uix-calendar>
        </div>
      `}
    `;
  },
};
```