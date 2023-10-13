import { BgColor, TextColor, Colors, BgOverlayOpacity } from "../uix.theme.mjs";

export default ({ T, html }) => ({
  i18n: {},
  views: {
    "uix-navbar": {
      props: {
        color: T.string({ enum: Colors }),
        shadow: T.boolean(),
        rounded: T.boolean(),
        height: T.string(),
        width: T.string(),
        items: T.array(),
        vertical: T.boolean(),
        gap: T.string({ defaultValue: "md" }),
        label: T.string(),
        icon: T.string(),
        classes: T.object(),
      },
      render: ({
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
        vertical,
      }) => {
        const {
          items: itemsClass = "text-gray-800 hover:text-blue-600",
          logo: logoClass = "font-bold text-2xl",
          container: containerClass,
        } = classes || {};

        const baseClasses = [
          "navbar flex overflow-y-auto overflow-x-hidden p-0",
          BgColor[color],
          shadow ? "shadow-xl" : "",
          rounded ? "rounded-box" : "",
          vertical ? "flex-col h-full" : "flex-row w-full",
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
    logoClass,
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
    items: itemsClass,
  }}
              color=${color}
              ?vertical=${vertical}
              gap=${gap || "lg"}
            ></uix-menu>
          </div>
        `;
      },
    },
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
        message: T.object({ defaultValue: { content: "", timestamp: "" } }),
        sender: T.object({ defaultValue: { name: "", avatar: "" } }),
        alignment: T.string({ defaultValue: "start", enum: ["start", "end"] }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        rounded: T.boolean(),
      },
      render: ({ message, sender, alignment, rounded, color }) => {
        const bgColorClass = BgColor[color];
        const AlignmentClasses = {
          start: "chat-start",
          end: "chat-end",
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
    ({ content, timestamp, sender }) => html`
                <uix-chat-message
                  .message=${{ content, timestamp }}
                  .sender=${sender}
                ></uix-chat-message>
              `,
  )}
          </div>
        `;
      },
    },
  },
});
