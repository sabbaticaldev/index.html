# Calendar Day

The Calendar Day component represents a single day within a calendar. It displays the day number and allows highlighting the current day or selected day.

## Props

| Name         | Type      | Default | Description                                           |
| ------------ | --------- | ------- | ----------------------------------------------------- |
| `previous`   | `boolean` | `false` | Indicates if the day belongs to the previous month    |
| `next`       | `boolean` | `false` | Indicates if the day belongs to the next month        |
| `currentDay` | `boolean` | `false` | Highlights the day as the current day                 |
| `selected`   | `boolean` | `false` | Highlights the day as selected                        |
| `day`        | `number`  | -       | The numeric value of the day                          |

## Examples

```html
<uix-calendar-day day="1"></uix-calendar-day>
<uix-calendar-day day="15" currentDay></uix-calendar-day>
<uix-calendar-day day="25" selected></uix-calendar-day>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-calendar-day",
  props: {
    previous: T.boolean(),
    next: T.boolean(),  
    currentDay: T.boolean(),
    selected: T.boolean(),
    day: T.number(),
  },
  theme: {
    "uix-calendar-day": ({ previous, next, currentDay, selected }) => ({
      _base: `focus:z-10 w-full p-1.5 ${
        (!next && !previous) || currentDay || selected ? "bg-white" : ""
      } ${currentDay ? "text-indigo-600 font-semibold" : ""}`,
    }),
    "uix-calendar-day__time": ({ selected }) => ({
      _base: `mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
        selected ? "bg-gray-900 font-semibold text-white" : ""
      }`,
    }),
  },
  render() {
    return html` <button type="button" class="uix-calendar-day">
      <time datetime="2022-01-01" class="uix-calendar-day__time"
        >${this.day}</time
      >
    </button>`;
  },
};
```