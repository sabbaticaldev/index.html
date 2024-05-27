import ChatCard from "./chat-card.js";
import ChatComposer from "./chat-composer.js";
import ChatMessage from "./chat-message.js";
import ChatWindow from "./chat-window.js";

export default {
  i18n: {},
  views: {
    "uix-chat-message": ChatMessage,
    "uix-chat-card": ChatCard,
    "uix-chat-composer": ChatComposer,
    "uix-chat-window": ChatWindow,
  },
};
