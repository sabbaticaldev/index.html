import "../layout/container.js";
import "../content/text.js";
import "../content/avatar.js";

import { ReactiveView } from "frontend";
import { html, T } from "helpers";
class ChatCard extends ReactiveView {
  static get properties() {
    return {
      message: T.string(),
      timestamp: T.string(),
      avatar: T.string(),
      sender: T.string(),
      rounded: T.boolean(),
      unread: T.number(),
      href: T.string(),
    };
  }

  static theme = {
    ".uix-chat__sender": "tracking-wide text-gray-700",
    ".uix-chat__message-preview":
      "text-gray-400 text-ellipsis text-xs overflow-hidden whitespace-nowrap w-36",
    ".uix-chat__timestamp-container": "text-right flex flex-col justify-evenly",
    ".uix-chat__timestamp": "text-xs text-gray-500",
  };

  render() {
    const { message, href, avatar, timestamp, unread, sender, rounded } = this;
    return html`
      <a href=${href}>
        <uix-container spacing="sm">
          <uix-container>
            ${
              avatar
                ? html`<uix-avatar
                    src=${avatar}
                    ?rounded=${rounded}
                  ></uix-avatar>`
                : ""
            }
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
              ${
                unread
                  ? html`<uix-badge>${unread}</uix-badge>`
                  : html`<div></div>`
              }
            <uix-container>
          <uix-container>
        </uix-container>
      </a>
    `;
  }
}

export default ReactiveView.define("uix-chat-card", ChatCard);
