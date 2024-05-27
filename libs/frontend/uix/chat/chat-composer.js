import { html, T } from "helpers";

const ChatComposer = {
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
      <div class=${this.theme("uix-chat-composer")}>
        <input
          type="text"
          placeholder=${this.placeholder}
          class=${this.theme("uix-chat-composer__input")}
        />
        <button
          @click=${this.send}
          class=${this.theme("uix-chat-composer__button")}
        >
          Send
        </button>
      </div>
    `;
  },
};

export default ChatComposer;
