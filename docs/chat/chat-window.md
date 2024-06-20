# chat-window

The `chat-window` component represents the main chat area where messages are displayed and composed.

## Props

| Prop       | Type    | Default | Description                        |
|------------|---------|---------|------------------------------------ |
| `messages` | `array` | `[]`    | The array of messages to display.  |

## Examples

```html
<uix-chat-window :messages="chatMessages"></uix-chat-window>
```

## Source Code

```js
import { html, T } from "frontend";

const ChatWindow = {
  tag: "uix-chat-window",
  props: {
    messages: T.array({ defaultValue: [] }),
  },
  theme: {
    "uix-chat-window": "flex flex-col h-full",
    "uix-chat-window__messages": "flex-grow overflow-y-auto p-4",
  },
  render() {
    return html`
      <div class="uix-chat-window__messages">
        ${this.messages.map(
          (message) => html`
            <uix-chat-message
              .message=${message.text}
              .timestamp=${message.timestamp}
              .sender=${message.sender}
            ></uix-chat-message>
          `,
        )}
      </div>
      <uix-chat-composer
        placeholder="Type a message..."
        .send=${() => {}}
      ></uix-chat-composer>
    `;
  },
};

export default ChatWindow;
```