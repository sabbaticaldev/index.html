# chat-card

The `chat-card` component represents a chat message preview in a chat list or conversation overview.

## Props

| Prop       | Type      | Default | Description                                            |
|------------|-----------|---------|--------------------------------------------------------|
| `message`  | `string`  | `''`    | The preview text of the chat message.                  |
| `timestamp`| `string`  | `''`    | The timestamp of the chat message.                     |
| `avatar`   | `string`  | `''`    | The URL of the sender's avatar image.                  |
| `sender`   | `string`  | `''`    | The name of the message sender.                        |
| `rounded`  | `boolean` | `false` | Whether the avatar should have rounded corners.        |
| `unread`   | `number`  | `0`     | The number of unread messages in the conversation.     |
| `href`     | `string`  | `''`    | The URL to navigate to when the chat card is clicked.  |

## Examples

```html
<uix-chat-card
  message="Hey, how's it going?"
  timestamp="2023-06-10T14:30:00Z"
  avatar="/path/to/avatar.jpg"
  sender="John Doe"
  :unread="2"
  href="/chat/123"
></uix-chat-card>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-chat-card",
  props: {
    message: T.string(),
    timestamp: T.string(), 
    avatar: T.string(),
    sender: T.string(),
    rounded: T.boolean(),
    unread: T.number(),
    href: T.string(),
  },
  theme: {
    "uix-chat__sender": "tracking-wide text-gray-700",
    "uix-chat__message-preview": 
      "text-gray-400 text-ellipsis text-xs overflow-hidden whitespace-nowrap w-36",
    "uix-chat__timestamp-container": "text-right flex flex-col justify-evenly",
    "uix-chat__timestamp": "text-xs text-gray-500",
  },
  render() {
    const { message, href, avatar, timestamp, unread, sender, rounded } = this;
    return html`
      <a href=${href}>
        <uix-container spacing="sm">
          <uix-container>
            ${avatar
              ? html`<uix-avatar src=${avatar} rounded=${rounded}></uix-avatar>`
              : ""}
            <uix-container justify="center" class="flex-grow">
              <uix-text size="sm" weight="bold" class="uix-chat__sender"
                >${sender}</uix-text
              >
              <uix-text
                weight="medium"
                size="xs"
                font="mono"
                class="uix-chat__message-preview"
              >
                ${message}
              </uix-text>
            <uix-container>
            <uix-container
              vertical
              justify="evenly"
              class="uix-chat__timestamp-container"
            >
              <uix-time
                class="uix-chat__timestamp"
                timestamp=${timestamp}
              ></uix-time>
              ${unread
                ? html`<uix-badge>${unread}</uix-badge>`
                : html`<div></div>`}
            <uix-container>
          <uix-container>
        </uix-container>
      </a>
    `;
  },
};
```