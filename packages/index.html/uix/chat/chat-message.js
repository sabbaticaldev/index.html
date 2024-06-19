import "../layout/container.js";
import "../content/text.js";
import "../content/link.js";
import "../content/avatar.js";
import "../datetime/time.js";

import { ReactiveView } from "frontend";
import { html, T } from "frontend";
class ChatMessage extends ReactiveView {
  static get properties() {
    return {
      message: T.string(),
      timestamp: T.object(),
      sender: T.object({ defaultValue: { name: "", avatar: "" } }),
      variant: T.string({ defaultValue: "base" }),
      rounded: T.boolean(),
    };
  }

  static theme = {
    ".uix-chat-message-container": "flex items-center",
    ".uix-chat-message": "flex flex-col bg-white p-3 rounded-lg shadow-md",
    ".uix-chat-timestamp": "text-xs text-gray-500 text-right mt-1",
  };

  render() {
    const { message, timestamp, sender, rounded } = this;
    const currentUser = sender?.name === "user" || !sender;
    return html`
      <uix-container class="uix-chat-message-container">
        ${!currentUser
          ? html`<uix-avatar
              size="xs"
              src=${sender.avatar}
              ?rounded=${rounded}
            ></uix-avatar>`
          : ""}
        <uix-container class="uix-chat-message" spacing="md">
          <uix-text font="mono" weight="light" size="xs">${message}</uix-text>
          <uix-time
            class="uix-chat-timestamp"
            timestamp=${timestamp}
          ></uix-time>
        </uix-container>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("uix-chat-message", ChatMessage);
