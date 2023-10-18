import T from "bootstrapp-shared/types.mjs";
import { html } from "lit";

import { BgColor, TextColor, Colors, BgOverlayOpacity } from "../uix.theme.mjs";

export default {
  i18n: {},
  views: {
    "uix-footer": {
      props: {
        sections: T.array(),
        bgColor: T.string({ defaultValue: "neutral", enum: Colors }),
        textColor: T.string({ defaultValue: "neutral-content", enum: Colors }),
        alignCenter: T.boolean(),
        rounded: T.boolean(),
      },
      render: ({ sections, bgColor, textColor, alignCenter, rounded }) => {
        const bgClass = BgColor[bgColor];
        const textClass = TextColor[textColor];
        const alignClass = alignCenter ? "footer-center" : "";
        const roundedClass = rounded ? "rounded" : "";

        return html`
          <footer
            class="p-10 footer ${bgClass} ${textClass} ${alignClass} ${roundedClass}"
          >
            ${sections.map((section) => {
    switch (section.type) {
    case "nav":
      return html`
                    <nav>
                      <header class="footer-title">${section.title}</header>
                      ${section.links.map(
    (link) =>
      html` <a class="link link-hover">${link}</a> `,
  )}
                    </nav>
                  `;
    case "aside":
      return html` <aside>${section.content}</aside> `;
    case "form":
      return html` <form>${section.content}</form> `;
    default:
      return "";
    }
  })}
          </footer>
        `;
      },
    },

    "uix-hero": {
      props: {
        title: T.string({ defaultValue: "Hello there" }),
        description: T.string(),
        color: T.string({ defaultValue: "base", enum: Colors }),
        imageUrl: T.string({ defaultValue: null }),
        overlayOpacity: T.number({ defaultValue: 60 }),
        rounded: T.boolean(),
      },
      render: ({
        title,
        description,
        color,
        imageUrl,
        rounded,
        overlayOpacity,
      }) => {
        const bgColorClass = BgColor[color];
        const textColorClass = TextColor[color];
        return html`
          <div
            class="hero min-h-[30rem] ,${(rounded && "rounded") ||
            ""} ${imageUrl
  ? `style="background-image: url(${imageUrl});"`
  : bgColorClass}"
          >
            ${imageUrl
    ? html`<div
                  class="hero-overlay ,${(rounded && "rounded") ||
                  ""} ${BgOverlayOpacity[overlayOpacity]}"
                ></div>`
    : ""}
            <div class="text-center hero-content ${textColorClass}">
              <div class="max-w-md">
                <h1 class="mb-5 text-5xl font-bold">${title}</h1>
                <p class="mb-5">${description}</p>
                <uix-button color="${color}">Get Started</uix-button>
              </div>
            </div>
          </div>
        `;
      },
    },

    "uix-stat-container": {
      props: {
        vertical: T.boolean(),
        shadow: T.boolean({ defaultValue: true }),
      },
      render: ({ vertical, shadow, children }) => {
        const directionClass = vertical ? "stats-vertical" : "";
        const shadowClass = shadow ? "shadow" : "";
        return html`
          <div class="stats ${directionClass} ${shadowClass}">${children}</div>
        `;
      },
    },

    "uix-chat-message": {
      props: {
        message: T.string(),
        timestamp: T.object(),
        sender: T.object({ defaultValue: { name: "", avatar: "" } }),
        alignment: T.string({ defaultValue: "start", enum: ["start", "end"] }),
        color: T.string({ defaultValue: "", enum: Colors }),
        rounded: T.boolean(),
      },
      render: ({ message, timestamp, sender, alignment, rounded, color }) => {
        const bgColorClass = BgColor[color];
        const AlignmentClasses = {
          start: "chat-start",
          end: "chat-end",
        };
        const alignmentClass = AlignmentClasses[alignment];
        return html`
          <uix-list class=${alignmentClass}>
            <uix-avatar
              ?rounded=${rounded}
              size="xs"
              src=${sender.avatar}
            ></uix-avatar>
            <div class="chat-header">${sender.name}</div>
            <uix-list
              vertical
              class="chat-bubble ${bgColorClass} ${(rounded && "") ||
              "rounded-none"}"
            >
              ${message}
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
      render: ({
        message,
        href,
        avatar,
        timestamp,
        unread,
        sender,
        rounded,
      }) => {
        return html`
          <a href=${href}>
            <uix-block spacing="sm">
              <uix-list containerClass="items-center">
                ${avatar
    ? html`
                      <uix-avatar src=${avatar} rounded=${rounded}></uix-avatar>
                    `
    : ""}
                <uix-list vertical class="justify-center flex-grow">
                  <uix-text size="xs">${sender}</uix-text>
                  <uix-text
                    weight="medium"
                    size="sm"
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
      },
    },
    "uix-space-bubble": {
      props: {
        avatar: T.string(),
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
                `,
  )}
          </div>
        `;
      },
    },
    "uix-chat-bubble": {
      props: {
        messages: T.array(),
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
                `,
  )}
          </div>
        `;
      },
    },
  },
};
