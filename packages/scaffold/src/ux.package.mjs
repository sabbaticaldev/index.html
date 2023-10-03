import {
  BgColor,
  TextColor,
  Variants,
  BgOverlayOpacity
} from "./style-props.mjs"; 

export default {
  i18n: {},
  views: {
    "uix-app-shell": {
      props: {
        icon: "",
        label: "",
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
      render: ({ leftNavbar, topNavbar, rightNavbar, bottomNavbar, icon, label }, { html }) => {
        
        return html`
          <div class="app-shell w-full h-full flex flex-col">
            ${topNavbar.items.length ? html`
              <uix-navbar icon=${icon} label=${label} padding="p-0" variant=${topNavbar.bgColor} height=${topNavbar.height || "h-16"} .items=${topNavbar.items}></uix-navbar>
            ` : ""}
            
            <div class="flex h-full">
              ${leftNavbar.items.length ? html`
                <uix-menu variant=${leftNavbar.bgColor} fullHeight width=${leftNavbar.width} .items=${leftNavbar.items}></uix-menu>
              ` : ""}
      
              <main class="content flex-grow">
                <slot></slot>
              </main>
      
              ${rightNavbar.items.length ? html`
                <uix-menu orientation="vertical" fullHeight variant=${rightNavbar.bgColor} width=${rightNavbar.width} .items=${rightNavbar.items}></uix-menu>
              ` : ""}
            </div>
            
            ${bottomNavbar.items.length ? html`
              <uix-navbar padding="p-0" variant=${bottomNavbar.bgColor} height=${bottomNavbar.height  || "h-16"} .items=${bottomNavbar.items}></uix-navbar>
            ` : ""}
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
                      <ul class="p-2 bg-${variant}">
                          ${submenu.map(subItem => html`
                              <li><a>${subItem.label}</a></li>
                          `)}
                      </ul>
                  </details>
              `;
        }
        return html`<li><a>${label}</a></li>`;
      }
    },
    "uix-navbar": {
      props: {
        variant: { 
          type: String,
          defaultValue: "base-100",
          enum: Variants
        },
        shadow: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false },
        height: { type: String, defaultValue: "" },
        width: { type: String, defaultValue: "" },
        items: { type: Array, defaultValue: [] },
        padding: {type: String, defautValue: "px-1" },
        label: "", 
        icon: ""
      },
      render: ({ variant, label, icon, shadow, height, width, padding, rounded, items }, { html }) => {    
        const bgClass = BgColor[variant];
        const baseClasses = `navbar ${padding} ${bgClass}`;        
        const shadowClass = shadow ? "shadow-xl" : "";
        const roundedClass = rounded ? "rounded-box" : "";
        
        return html`
          <div class="${baseClasses} ${shadowClass} ${roundedClass} ${height || ""} ${width || ""}">
              ${items.length > 0 ? html`
                  <div class="flex-none gap-2 w-full">
                      <ul class="menu menu-horizontal items-center justify-between flex flex-row w-full ${padding} ${bgClass}">      
                        <li class="w-72 h-16 bg-gray-800  text-white flex items-center justify-center">
                          <a class="hover:text-primary-200">
                            <ion-icon
                              name=${icon}
                              class="text-2xl"
                              role="img"
                            ></ion-icon>
                            <h2 class="text-xl bold">
                              ${label}
                            </h2>
                          </a>
                        </li>
      
                        ${items.map(item => html`
                            <li class="${item.height || ""} ${item.width || ""}"><uix-navbar-item .label=${item.label} .submenu=${item.submenu} .component=${item.component}></uix-navbar-item></li>
                        `)}
                      </ul>
                  </div>
              ` : ""}
          </div>
          `;
      },
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

    "uix-stat": {
    // TODO: expand daisyui tags for tailwind JIT
      props: {
        title: { type: String, required: true },
        value: { type: String, required: true },
        desc: { type: String, required: true },
        figure: { type: String, defaultValue: null },
        valueColor: { type: String, defaultValue: "default", enum: Variants },
        descColor: { type: String, defaultValue: "default", enum: Variants }
      },
      render: ({ title, value, desc, figure, valueColor, descColor }, { html }) => {
        const valueColorClass = `text-${valueColor}-focus`;
        const descColorClass = `text-${descColor}-focus`;
        return html`
        <div class="stat">
          ${figure ? html`<div class="stat-figure ${valueColorClass}">${figure}</div>` : ""}
          <div class="stat-title">${title}</div>
          <div class="stat-value ${valueColorClass}">${value}</div>
          <div class="stat-desc ${descColorClass}">${desc}</div>
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
      