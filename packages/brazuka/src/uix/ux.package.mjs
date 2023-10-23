import T from "brazuka-helpers";
import { html } from "https://esm.sh/lit";
import { BgColor, Colors } from "../uix.theme.mjs";

export default {
  i18n: {},
  views: {
    "uix-chat-message": {
      props: {
        message: T.string(),
        timestamp: T.object(),
        sender: T.object({ defaultValue: { name: "", avatar: "" } }),
        color: T.string({ defaultValue: "base", enum: Colors }),
        rounded: T.boolean()
      },
      render: ({ message, timestamp, sender, rounded, color }) => {
        const currentUser = sender?.name === "user" || !sender;
        const bgColorClass = !currentUser
          ? BgColor[color]
          : "bg-gray-800 text-white";

        const baseClass = [
          "prose text-sm",
          bgColorClass,
          (rounded && "") || "rounded-none"
        ]
          .filter(Boolean)
          .join(" ");
        return html`
          <uix-list>
            ${(!currentUser &&
              html`<uix-avatar
                ?rounded=${rounded}
                size="xs"
                src=${sender.avatar}
              ></uix-avatar>`) ||
            ""}
            <uix-list vertical containerClass=${baseClass} spacing="md">
              <uix-text font="mono" weight="light" size="xs">
                ${message}
              </uix-text>
              <uix-time
                class="text-xs opacity-50 text-right"
                timestamp=${timestamp}
              ></uix-time>
            </uix-list>
          </uix-list>
        `;
      }
    },

    "uix-chat-card": {
      props: {
        message: T.string(),
        timestamp: T.string(),
        avatar: T.string(),
        sender: T.string(),
        rounded: T.boolean(),
        unread: T.number(),
        href: T.string()
      },
      render: ({
        message,
        href,
        avatar,
        timestamp,
        unread,
        sender,
        rounded
      }) => {
        return html`
          <a href=${href}>
            <uix-block spacing="sm">
              <uix-list>
                ${avatar
    ? html`
                      <uix-avatar src=${avatar} rounded=${rounded}></uix-avatar>
                    `
    : ""}
                <uix-list vertical class="justify-center flex-grow">
                  <uix-text
                    size="sm"
                    weight="bold"
                    class="tracking-wide text-gray-700"
                    >${sender}</uix-text
                  >
                  <uix-text
                    weight="medium"
                    size="xs"
                    font="mono"
                    containerClass="text-gray-400 text-ellipsis text-xs overflow-hidden whitespace-nowrap w-36"
                  >
                    ${message}
                  </uix-text>
                </uix-list>
                <uix-list vertical containerClass="justify-evenly text-right">
                  <uix-time
                    class="text-xs opacity-50"
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
      }
    },
    "uix-space-bubble": {
      props: {
        avatar: T.string()
      },
      render: ({ messages }) => {
        return messages.map(
          (message) =>
            html`
              <uix-chat-message
                message=${message.message}
                timestamp=${message.timestamp}
                .sender=${message.sender}
              ></uix-chat-message>
            `
        );
      }
    },
    "uix-chat-bubble": {
      props: {
        messages: T.array()
      },
      render: ({ messages }) => {
        return html`
          <div class="chat-bubble-container">
            ${messages.map(
    (message) =>
      html`
                  <uix-chat-message
                    message=${message.message}
                    timestamp=${message.timestamp}
                    .sender=${message.sender}
                  ></uix-chat-message>
                `
  )}
          </div>
        `;
      }
    }
  }
};
