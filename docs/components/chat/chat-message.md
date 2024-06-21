# chat-message

The `chat-message` component displays an individual chat message within a conversation.

## Props

| Prop        | Type     | Default                       | Description                                 |
|-------------|----------|-------------------------------|---------------------------------------------|
| `message`   | `string` | `''`                          | The text content of the chat message.       |
| `timestamp` | `object` | `undefined`                   | The timestamp of when the message was sent. |
| `sender`    | `object` | `{ name: '', avatar: '' }`    | The sender's name and avatar URL.           |
| `variant`   | `string` | `'base'`                      | The variant style of the message.           |
| `rounded`   | `boolean`| `false`                       | Whether the message has rounded corners.    |

## Examples

```html
<uix-chat-message
  message="Hello, how can I assist you today?"
  :timestamp="{ date: '2023-06-10', time: '14:30' }"
  :sender="{ name: 'Support Agent', avatar: '/path/to/avatar.jpg' }"
  variant="agent"
  rounded
></uix-chat-message>
```

## Source Code

```js
import { html, T } from "frontend";

export default {
  tag: "uix-chat-message",
  props: {
    message: T.string(),
    timestamp: T.object(),
    sender: T.object({ defaultValue: { name: "", avatar: "" } }),
    variant: T.string({ defaultValue: "base" }),
    rounded: T.boolean(),
  },
  theme: {
    "uix-chat-message-container": "flex items-center",
    "uix-chat-message": "flex flex-col bg-white p-3 rounded-lg shadow-md",
    "uix-chat-timestamp": "text-xs text-gray-500 text-right mt-1",
  },
  render() {
    const { message, timestamp, sender } = this;
    const currentUser = sender?.name === "user" || !sender;
    return html`
      <uix-container class="uix-chat-message-container">
        ${!currentUser
          ? html`<uix-avatar size="xs" src=${sender.avatar}></uix-avatar>`
          : ""}
        <uix-container class="uix-chat-message" spacing="md">
          <uix-text font="mono" weight="light" size="xs">${message}</uix-text>
          <uix-time
            class="uix-chat-timestamp"
            timestamp=${timestamp}
          ></uix-time>
        <uix-container>
      <uix-container>
    `;
  },
};
```