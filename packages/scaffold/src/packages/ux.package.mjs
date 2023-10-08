import {
  BgColor,
  TextColor,
  Colors,
  BgOverlayOpacity
} from "../style-props.mjs";

export default {
  i18n: {},
  views: {
    "uix-navbar": {
      props: {
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        },
        shadow: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false },
        height: { type: String, defaultValue: "" },
        width: { type: String, defaultValue: "" },
        items: { type: Array, defaultValue: [] },
        vertical: { type: Boolean, defaultValue: false },
        gap: { type: String, defaultValue: "md" },
        label: "",
        icon: "",
        classes: { type: Object, defaultValue: {} }
      },
      render: (
        {
          classes,
          color,
          label,
          icon,
          shadow,
          height,
          width,
          gap,
          rounded,
          items,
          vertical
        },
        { html }
      ) => {
        const {
          items: itemsClass = "text-gray-800 hover:text-blue-600",
          logo: logoClass = "font-bold text-2xl",
          container: containerClass
        } = classes || {};

        const baseClasses = [
          "navbar flex overflow-y-auto overflow-x-hidden p-0",
          BgColor[color],
          shadow ? "shadow-xl" : "",
          rounded ? "rounded-box" : "",
          vertical ? "flex-col h-full" : "flex-row w-full"
        ]
          .filter(Boolean)
          .join(" ");

        return html`
          <div
            class="${baseClasses} ${height || ""} ${width ||
            ""} ${containerClass}"
          >
            ${icon && label
    ? html`
                  <a
                    class=${[
    `cursor-pointer flex items-center text-center 
                justify-center gap-2`,
    vertical
      ? "w-full h-16 border-b mb-4"
      : "h-full w-72 border-r pr-4",
    logoClass
  ].join(" ")}
                    href="/"
                  >
                    <ion-icon name=${icon} role="img"></ion-icon>
                    <h2>${label}</h2>
                  </a>
                `
    : ""}
            <uix-menu
              .items=${items}
              .classes=${{
    items: itemsClass
  }}
              color=${color}
              ?vertical=${vertical}
              gap=${gap || "lg"}
            ></uix-menu>
          </div>
        `;
      }
    },
    "uix-footer": {
      props: {
        sections: {
          type: Array,
          defaultValue: [] // Each section can be a nav, aside, or form
        },
        bgColor: {
          type: String,
          defaultValue: "neutral",
          enum: Colors
        },
        textColor: {
          type: String,
          defaultValue: "neutral-content",
          enum: Colors
        },
        alignCenter: {
          type: Boolean,
          defaultValue: false
        },
        rounded: {
          type: Boolean,
          defaultValue: false
        }
      },
      render: (
        { sections, bgColor, textColor, alignCenter, rounded },
        { html }
      ) => {
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
    (link) => html` <a class="link link-hover">${link}</a> `
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
      }
    },

    "uix-hero": {
      props: {
        title: { type: String, defaultValue: "Hello there" },
        description: { type: String, defaultValue: "" },
        color: { type: String, defaultValue: "base", enum: Colors },
        imageUrl: { type: String, defaultValue: null },
        overlayOpacity: { type: Number, defaultValue: 60 },
        rounded: { type: Boolean, defaultValue: false }
      },
      render: (
        { title, description, color, imageUrl, rounded, overlayOpacity },
        { html }
      ) => {
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
      }
    },

    "uix-stat-container": {
      props: {
        vertical: { type: Boolean, defaultValue: false },
        shadow: { type: Boolean, defaultValue: true }
      },
      render: ({ vertical, shadow, children }, { html }) => {
        const directionClass = vertical ? "stats-vertical" : "";
        const shadowClass = shadow ? "shadow" : "";
        return html`
          <div class="stats ${directionClass} ${shadowClass}">${children}</div>
        `;
      }
    },

    "uix-chat-message": {
      props: {
        message: { type: Object, defaultValue: { content: "", timestamp: "" } },
        sender: { type: Object, defaultValue: { name: "", avatar: "" } },
        alignment: {
          type: String,
          defaultValue: "start",
          enum: ["start", "end"]
        },
        color: {
          type: String,
          defaultValue: "primary",
          enum: Colors
        },
        rounded: { type: Boolean, defaultValue: false }
      },
      render: ({ message, sender, alignment, rounded, color }, { html }) => {
        const bgColorClass = BgColor[color];
        const AlignmentClasses = {
          start: "chat-start",
          end: "chat-end"
        };
        const alignmentClass = AlignmentClasses[alignment];
        return html`
          <div class="${alignmentClass}">
            ${sender.avatar
    ? html`
                  <div class="chat-image avatar">
                    <div class="w-10 ${(rounded && "rounded-full") || ""}">
                      <img src=${sender.avatar} />
                    </div>
                  </div>
                `
    : ""}
            <div class="chat-header">
              ${sender.name}
              <time class="text-xs opacity-50">${message.timestamp}</time>
            </div>
            <div class="chat-bubble ${bgColorClass}">${message.content}</div>
          </div>
        `;
      }
    },
    "uix-chat-bubble": {
      props: {
        messages: { type: Array, defaultValue: [] }
      },
      render: ({ messages }, { html }) => {
        return html`
          <div class="chat-bubble-container">
            ${messages.map(
    ({ content, timestamp, sender }) => html`
                <uix-chat-message
                  .message=${{ content, timestamp }}
                  .sender=${sender}
                ></uix-chat-message>
              `
  )}
          </div>
        `;
      }
    }
  }
};
