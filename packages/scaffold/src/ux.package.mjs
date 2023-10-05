import {
  BgColor,
  TextColor,
  Variants,
  BgOverlayOpacity,
  Directions
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      props: {
        icon: "",
        label: "",
        mainNavbar: {
          type: String, 
          defaultValue: "topNavbar", 
          enum: ["topNavbar", "leftNavbar", "bottomNavbar", "rightNavbar"]
        },
        topNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },          
          height: { type: String, defaultValue: "h-16" },
        },
        leftNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },          
          width: { type: String, defaultValue: "w-72" },
        },
        rightNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          width: { type: String, defaultValue: "w-72" },
        },
        bottomNavbar: {
          bgColor: { type: String, defaultValue: "primary", enum: BgColor },
          textColor: { type: String, defaultValue: "primary", enum: TextColor },
          items: { type: Array, defaultValue: [] },
          height: { type: String, defaultValue: "h-16" },
        }
      },
      render: ({ mainNavbar, leftNavbar, topNavbar, rightNavbar, bottomNavbar, icon, label }, { html }) => {        
        const renderNavbar = (navbar, orientation) => {
          const isMain = mainNavbar === orientation;
          return navbar.items.length ? html`
        <uix-navbar
          class="bg-base-100 border-r"
          icon=${isMain ? icon : ""}
          label=${isMain ? label : ""}
          padding="p-0"
          direction=${["rightNavbar","leftNavbar"].includes(orientation) ? "vertical" : "horizontal"}
          variant=${navbar.bgColor}
          height=${navbar.height || ""}
          width=${navbar.width || "w-72"}
          .items=${navbar.items}>
        </uix-navbar>
      ` : "";
        };

        const renderMenu = (navbar, orientation) => {
          return navbar.items.length ? html`
            <uix-menu
              direction=${["rightNavbar","leftNavbar"].includes(orientation) ? "vertical" : "horizontal"}
              fullHeight
              variant=${navbar.bgColor}
              width=${navbar.width || "w-72"}
              height=${navbar.height || ""}
              .items=${navbar.items}>
            </uix-menu>
          ` : "";
        };

        return html`
      <div class="app-shell w-full h-full flex flex-col">
        ${mainNavbar === "topNavbar" ? renderNavbar(topNavbar, "topNavbar") : renderMenu(topNavbar, "topNavbar")}
        
        <div class="flex h-full">
          ${mainNavbar === "leftNavbar" ? renderNavbar(leftNavbar, "leftNavbar") : renderMenu(leftNavbar, "leftNavbar")}
          
          <main class="relative content flex-grow overflow-y-auto">
            <slot></slot>
          </main>
          
          ${mainNavbar === "rightNavbar" ? renderNavbar(rightNavbar, "rightNavbar") : renderMenu(rightNavbar, "rightNavbar")}
        </div>

        ${mainNavbar === "bottomNavbar" ? renderNavbar(bottomNavbar, "bottomNavbar") : renderMenu(bottomNavbar, "bottomNavbar")}
      </div>
    `;
      },
    }, 
    "uix-navbar-item": {
      props: {
        component: { type: Function, defaultValue: null },
        label: { type: String, defaultValue: "" },
        icon: "",
        submenu: { type: Array, defaultValue: [] },
        variant: { type: Array, defaultValue: "" },
      },
      render: ({ component, label, icon, submenu, variant }, { html }) => {
        if (component) {
          return component;
        }
        
        const iconClass = icon ? html`<uix-icon name=${icon}></uix-icon>` : "";
        
        if (submenu?.length > 0) {
          return html`
                  <details>
                      ${iconClass}
                      <summary>${label}</summary>
                      <ul class="p-2 ${BgColor[variant] || ""}">
                          ${submenu.map(subItem => html`
                              <li><a href=${subItem.href || "#"}>
                              ${subItem.icon && html`<ion-icon
                                name=${subItem.icon}
                                role="img"
                                ></ion-icon>`}
                              ${subItem.label}</a></li>
                          `)}
                      </ul>
                  </details>
              `;
        }
        return html`<li>
                      <a class="leading-2 flex items-center gap-2">
                        ${iconClass}
                        ${label}
                      </a>
                    </li>`;
      }
    },
    "uix-navbar": {
      props: {
        variant: { 
          type: String,
          defaultValue: "base",
          enum: Variants
        },
        shadow: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false },
        height: { type: String, defaultValue: "" },
        width: { type: String, defaultValue: "" },
        items: { type: Array, defaultValue: [] },
        direction: { type: String, defaultValue: "horizontal", enum: Directions },
        gap: { type: String, defaultValue: "md" },
        label: "", 
        icon: "",
        classes: { type: Object, defaultValue: {} },
      },
      render: ({ 
        classes: {
          link: linkClass = "text-gray-800 hover:text-gray-600",
          container: containerClass
        }, 
        variant, label, icon, direction, shadow, 
        height, width, gap, rounded, items 
      }, { html }) => {
        
        const baseClasses = [
          "navbar flex overflow-y-auto overflow-x-hidden", 
          BgColor[variant],           
          shadow ? "shadow-xl" : "", 
          rounded ? "rounded-box" : "",
          direction === "vertical" ? "flex-col h-full" : "flex-row w-full"
        ].filter(c => !!c).join(" ");
    
    
        return html`
          <div class="${baseClasses} ${height || ""} ${width || ""} ${containerClass}">
            ${icon && label ? html`
                <a class=${[`cursor-pointer flex items-center text-center 
                justify-center gap-2`, direction === "vertical" ? "w-full h-16 border-b mb-4" : "h-full w-72 border-r mr-4", linkClass].join(" ")} href="/">
                  <ion-icon
                    name=${icon}
                    class="text-2xl"
                    role="img"
                  ></ion-icon>
                  <h2 class="text-xl bold">
                    ${label}
                  </h2>
                </a>
              
            ` : ""}
            <uix-menu
              .items=${items}
              variant=${variant}
              direction=${direction}
              gap=${gap || "lg"}
              .classes=${{
    container: linkClass
  }}
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
          enum: Variants
        },
        textColor: { 
          type: String,
          defaultValue: "neutral-content",
          enum: Variants
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
      render: ({ sections, bgColor, textColor, alignCenter, rounded }, { html }) => {
        const bgClass = BgColor[bgColor];
        const textClass = TextColor[textColor];
        const alignClass = alignCenter ? "footer-center" : "";
        const roundedClass = rounded ? "rounded" : "";

        return html`
        <footer class="p-10 footer ${bgClass} ${textClass} ${alignClass} ${roundedClass}">
          ${sections.map(section => {
    switch (section.type) {
    case "nav":
      return html`
                  <nav>
                    <header class="footer-title">${section.title}</header>
                    ${section.links.map(link => html`
                      <a class="link link-hover">${link}</a>
                    `)}
                  </nav>
                `;
    case "aside":
      return html`
                  <aside>
                    ${section.content}
                  </aside>
                `;
    case "form":
      return html`
                  <form>
                    ${section.content}
                  </form>
                `;
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
        variant: { type: String, defaultValue: "base", enum: Variants },
        imageUrl: { type: String, defaultValue: null },
        overlayOpacity: { type: Number, defaultValue: 60 },
        rounded: { type: Boolean, defaultValue: false },
      },
      render: ({ title, description, variant, imageUrl, rounded, overlayOpacity }, { html }) => {
        const bgColorClass = BgColor[variant];
        const textColorClass = TextColor[variant];
        return html`
        <div class="hero min-h-[30rem] ,${rounded && "rounded" || ""} ${imageUrl ? `style="background-image: url(${imageUrl});"` : bgColorClass}">
          ${imageUrl ? html`<div class="hero-overlay ,${rounded && "rounded" || ""} ${BgOverlayOpacity[overlayOpacity]}"></div>` : ""}
          <div class="text-center hero-content ${textColorClass}">
            <div class="max-w-md">
              <h1 class="mb-5 text-5xl font-bold">${title}</h1>
              <p class="mb-5">${description}</p>
              <uix-button variant="${variant}">Get Started</uix-button>
            </div>
          </div>
        </div>
      `;
      },
    },

    "uix-stat-container": {
      props: {
        direction: { type: String, defaultValue: "horizontal", enum: ["horizontal", "vertical"] },
        shadow: { type: Boolean, defaultValue: true }
      },
      render: ({ direction, shadow, children }, { html }) => {
        const directionClass = direction === "vertical" ? "stats-vertical" : "";
        const shadowClass = shadow ? "shadow" : "";
        return html`
        <div class="stats ${directionClass} ${shadowClass}">
          ${children}
        </div>
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
        variant: {
          type: String,
          defaultValue: "primary",
          enum: Variants
        },
        rounded: { type: Boolean, defaultValue: false },
      },
      render: ({ message, sender, alignment, rounded, variant }, { html }) => {
        const bgColorClass = BgColor[variant];
        const AlignmentClasses = {
          "start": "chat-start",
          "end": "chat-end"
        };
        const alignmentClass = AlignmentClasses[alignment];
        return html`
          <div class="${alignmentClass}">
            ${sender.avatar ? html`
              <div class="chat-image avatar">
                <div class="w-10 ${rounded && "rounded-full" || ""}">
                  <img src=${sender.avatar} />
                </div>
              </div>
            ` : ""}
            <div class="chat-header">
              ${sender.name}
              <time class="text-xs opacity-50">${message.timestamp}</time>
            </div>
            <div class="chat-bubble ${bgColorClass}">
              ${message.content}
            </div>
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
          ${messages.map(({ content, timestamp, sender }) => html`
            <uix-chat-message .message=${{ content, timestamp }} .sender=${sender}></uix-chat-message>
          `)}
        </div>
      `;
      }
    },
  },
};
      