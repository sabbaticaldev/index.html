import { ReactiveView } from "frontend";
import { html, T } from "frontend";

class ChatComposer extends ReactiveView {
  static get properties() {
    return {
      placeholder: T.string({ defaultValue: "Type a message..." }),
      send: T.function(),
    };
  }

  static theme = {
    "": "flex items-center p-4 bg-white border-t border-gray-200",
    ".uix-chat-composer__input":
      "flex-grow px-4 py-2 mr-4 bg-gray-100 rounded-full",
    ".uix-chat-composer__button":
      "bg-blue-500 text-white px-4 py-2 rounded-full",
  };

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
  }
}

export default ReactiveView.define("uix-chat-composer", ChatComposer);
