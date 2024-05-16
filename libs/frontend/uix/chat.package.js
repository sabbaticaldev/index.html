import { html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.1.3/all/lit-all.min.js";

import { T } from "helpers/types.js";

export default {
  i18n: {},
  views: {
    "uix-chat-message": {
      props: {
        message: T.string(),
        timestamp: T.object(),
        sender: T.object({ defaultValue: { name: "", avatar: "" } }),
        variant: T.string({ defaultValue: "base" }),
        rounded: T.boolean(),
      },
      render: function () {
        const { message, timestamp, sender } = this;
        const currentUser = sender?.name === "user" || !sender;
        return html`
          <uix-list>
            ${(!currentUser &&
              html`<uix-avatar size="xs" src=${sender.avatar}></uix-avatar>`) ||
            ""}
            <uix-list
              vertical
              containerClass=${this.generateTheme("uix-chat-message")}
              spacing="md"
            >
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
      },
    },

    "uix-chat-card": {
      props: {
        message: T.string(),
        timestamp: T.string(),
        avatar: T.string(),
        sender: T.string(),
        rounded: T.boolean(),
        unread: T.number(),
        href: T.string(),
      },
      render: function () {
        const { message, href, avatar, timestamp, unread, sender, rounded } =
          this;
        return html`
          <a href=${href}>
            <uix-block spacing="sm">
              <uix-list>
                ${avatar
    ? html`
                      <uix-avatar src=${avatar} rounded=${rounded}></uix-avatar>
                    `
    : ""}
                <uix-list vertical justify="center" class="flex-grow">
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
                <uix-list vertical justify="evenly" containerClass="text-right">
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
      },
    },
  },
};
