import "./chat-message.js";
import "./chat-composer.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";
class ChatWindow extends ReactiveView {
  static get properties() {
    return {
      messages: T.array({ defaultValue: [] }),
    };
  }

  static theme = {
    "": "flex flex-col h-full",
    ".uix-chat-window__messages": "flex-grow overflow-y-auto p-4",
  };

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
  }
}

export default ReactiveView.define("uix-chat-window", ChatWindow);
