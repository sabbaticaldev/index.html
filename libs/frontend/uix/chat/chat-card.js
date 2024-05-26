import { html, T } from "helpers";

export default {
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
        <uix-block spacing="sm">
          <uix-list>
            ${avatar
              ? html`<uix-avatar src=${avatar} rounded=${rounded}></uix-avatar>`
              : ""}
            <uix-list vertical justify="center" class="flex-grow">
              <uix-text
                size="sm"
                weight="bold"
                class=${this.theme("uix-chat__sender")}
                >${sender}</uix-text
              >
              <uix-text
                weight="medium"
                size="xs"
                font="mono"
                containerClass=${this.theme("uix-chat__message-preview")}
              >
                ${message}
              </uix-text>
            </uix-list>
            <uix-list
              vertical
              justify="evenly"
              containerClass=${this.theme("uix-chat__timestamp-container")}
            >
              <uix-time
                class=${this.theme("uix-chat__timestamp")}
                timestamp=${timestamp}
              ></uix-time>
              ${unread
    ? html`<uix-badge>${unread}</uix-badge>`
    : html`<div></div>`}
            </uix-list>
          </uix-list>
        </uix-block>
      </a>
    `;
  },
};
