# Time

The Time component displays a formatted time based on a provided timestamp.

## Props

| Name        | Type     | Default | Description                                         |
| ----------- | -------- | ------- | --------------------------------------------------- |
| `timestamp` | `number` | -       | The timestamp to format and display                 |

## Examples

```html
<uix-time timestamp="1623456789"></uix-time>
```

## Source Code

```js
import { datetime, html, T } from "frontend";

export default {
  tag: "uix-time",
  props: { timestamp: T.number() },
  theme: {
    "uix-time": "whitespace-nowrap",
  },
  render() {
    return html`<time class="uix-time"
      >${datetime.formatTime(this.timestamp)}</time
    >`;
  },
};
```