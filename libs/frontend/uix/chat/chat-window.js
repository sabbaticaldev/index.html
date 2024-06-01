import { html, T } from "helpers";

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
      <div class=${this.theme("uix-chat-window")}>
        <div class=${this.theme("uix-chat-window__messages")}>
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
      </div>
    `;
  },
};

export default ChatWindow;
