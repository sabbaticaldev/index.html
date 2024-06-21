# Calendar

The Calendar component provides a complete calendar view with month navigation. It allows selecting a specific date and supports minimum and maximum date restrictions.

## Props

| Name     | Type       | Default | Description                                         |
| -------- | ---------- | ------- | --------------------------------------------------- |
| `value`  | `string`   | -       | The currently selected date in ISO format (YYYY-MM-DD) |
| `min`    | `string`   | -       | The minimum selectable date in ISO format (YYYY-MM-DD) |
| `max`    | `string`   | -       | The maximum selectable date in ISO format (YYYY-MM-DD) |
| `change` | `function` | -       | Callback function triggered when the selected date changes |

## Examples

```html
<uix-calendar value="2023-06-15"></uix-calendar>
<uix-calendar value="2023-12-01" min="2023-01-01" max="2023-12-31"></uix-calendar>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-calendar",
  props: {
    value: T.string(),
    min: T.string(),
    max: T.string(),
    change: T.function(),
  },
  theme: {
    "uix-calendar": "",
  },
  render() {
    return html`
      <div class="uix-calendar">
        <uix-calendar-month
          month=${new Date(this.value).getMonth() + 1}
          year=${new Date(this.value).getFullYear()}
          .selectedDay=${new Date(this.value).getDate()}
          .min=${this.min}
          .max=${this.max}
          .change=${this.change}
        ></uix-calendar-month>
      </div>
    `;
  },
};
```