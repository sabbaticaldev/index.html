# chat-composer

The `chat-composer` component allows users to compose and send chat messages.

## Props

| Prop          | Type       | Default             | Description                                 |
|---------------|------------|---------------------|---------------------------------------------|
| `placeholder` | `string`   | `'Type a message...'` | The placeholder text for the input field. |
| `send`        | `function` | `undefined`         | The function to call when sending a message.|

## Examples

```html
<uix-chat-composer
  placeholder="Type your message here..."
  :send="sendMessage"
></uix-chat-composer>
```

## Source Code

```js
import { html, T } from "frontend";

const ChatComposer = {
  tag: "uix-chat-composer",
  props: {
    placeholder: T.string({ defaultValue: "Type a message..." }),
    send: T.function(),
  },
  theme: {
    "uix-chat-composer":
      "flex items-center p-4 bg-white border-t border-gray-200",
    "uix-chat-composer__input":
      "flex-grow px-4 py-2 mr-4 bg-gray-100 rounded-full",
    "uix-chat-composer__button":
      "bg-blue-500 text-white px-4 py-2 rounded-full",
  },
  render() {
    return html`
      <input
        type="text"
        placeholder=${this.placeholder}
        class="uix-chat-composer__input"
      />
      <button @click=${this.send} class="uix-chat-composer__button">
        Send
      </button>
    `;
  },
};

export default ChatComposer;
```