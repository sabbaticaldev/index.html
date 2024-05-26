import { html, T } from "helpers";

export default {
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
      <uix-list class=${this.theme("uix-chat-message-container")}>
        ${!currentUser
          ? html`<uix-avatar size="xs" src=${sender.avatar}></uix-avatar>`
          : ""}
        <uix-list
          vertical
          containerClass=${this.theme("uix-chat-message")}
          spacing="md"
        >
          <uix-text font="mono" weight="light" size="xs">${message}</uix-text>
          <uix-time
            class=${this.theme("uix-chat-timestamp")}
            timestamp=${timestamp}
          ></uix-time>
        </uix-list>
      </uix-list>
    `;
  },
};
