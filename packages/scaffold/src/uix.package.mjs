const ModalPositions = {
  "top": "modal-top",
  "middle": "modal-middle",
  "bottom": "modal-bottom",
};
const Methods = ["details", "focus"];
const Sizes = ["lg", "md", "sm", "xs"];
const Shapes = ["default", "circle", "square"];
const Styles = ["ghost", "link", "outline", "glass", "active", "disabled"];
const Triggers = ["click", "hover"];
const Directions = ["horizontal", "vertical"];
const Positions = ["top", "end", "bottom", "left", "right", "top-right", "top-left", "bottom-right", "bottom-left"];
const Formats = ["DHMS", "HMS", "MS", "S"];
const IndicatorsFormat = ["percentage", "absolute"];
const Variants = ["primary", "secondary", "accent", "neutral", "base", "info", "success", "warning", "error"];

export default {
  "uix-accordion": {
    props: {
      items: { type: Array, defaultValue: [] },
      variant: { type: String, defaultValue: "base", enum: Variants },
      method: { type: String, defaultValue: "focus", enum: ["focus", "checkbox", "details"] }, // Propagate the method of collapsing.
      icon: { type: String, defaultValue: "", enum: ["", "arrow", "plus"] }, // Propagate the icon type.
    },
    render: ({ items, variant, method, icon }, { html }) => {
      return html`
            ${items.map(item => html`
              <uix-collapse
                title=${item.title}
                content=${item.content}
                variant=${variant}
                method=${method}
                icon=${icon}
              ></uix-collapse>
            `)}
          `;
    },
  },
  "uix-alert": {
    props: {
      title: { type: String, defaultValue: "" },
      message: { type: String, defaultValue: "Alert Message" },
      variant: { 
        type: String,
        defaultValue: "info",
        enum: Variants
      },
      closable: { type: Boolean, defaultValue: true },
      actions: { type: Array, defaultValue: [] }
    },
    render: ({ title, message, variant, closable, actions }, { html }) => {
      const colorClass = `bg-${variant}-200 border-${variant}-content text-${variant}-focus`;
      
      return html`
        <div class="alert p-4 rounded shadow-lg ${colorClass}">
          <div class="flex justify-between">
            <div>
              ${title ? html`<h3 class="font-bold mb-2">${title}</h3>` : ""}
              <div class="text-xs">${message}</div>
            </div>
            <div>
              ${closable ? html`<uix-button label="&times;" variant="neutral" action=${()=> dispatchEvent(new CustomEvent("close-alert"))}></uix-button>` : ""}
            </div>
          </div>
          ${actions.length > 0 ? html`
            <div class="mt-4">
              ${actions.map(action => 
    html`<uix-button .label=${action.label} .action=${action.action}></uix-button>`
  )}
            </div>
          ` : ""}
        </div>
      `;
    },
  },
  "uix-avatar": {
    props: {
      src: { type: String },
      alt: { type: String, defaultValue: "" },
      size: { type: Number, defaultValue: 24 },
      shape: { type: String, defaultValue: "rounded", enum: ["rounded", "rounded-full", "mask-squircle", "mask-hexagon", "mask-triangle"] },
      status: { type: String, enum: ["online", "offline", ""] },
      placeholder: { type: String, defaultValue: "" },
      hasRing: { type: Boolean, defaultValue: false },
      ringColor: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ src, alt, size, shape, status, placeholder, hasRing, ringColor }, { html }) => {
      const sizeClass = `w-${size}`;
      const ringClass = hasRing ? `ring ring-${ringColor} ring-offset-base-100 ring-offset-2` : "";
      let content;
      
      if (src) {
        content = html`<img src=${src} alt=${alt} />`;
      } else if (placeholder) {
        content = html`<span class="${size > 12 ? `text-${Math.round(size / 8)}xl` : "text-xs"}">${placeholder}</span>`;
      }
      
      return html`
        <div class="avatar ${status} ${ringClass}">
          <div class="${sizeClass} ${shape}">
            ${content}
          </div>
        </div>
      `;
    },
  },
  "uix-avatar-group": {
    props: {
      avatars: { type: Array, defaultValue: [] },
      count: { type: Number, defaultValue: 0 }
    },
    render: ({ avatars, count }, { html }) => {
      return html`
        <div class="avatar-group -space-x-6">
          ${avatars.map(avatar => html`
            <uix-avatar 
              src=${avatar.src} 
              alt=${avatar.alt} 
              size=${avatar.size}
              shape=${avatar.shape}
              status=${avatar.status}
              placeholder=${avatar.placeholder}
              hasRing=${avatar.hasRing}
              ringColor=${avatar.ringColor}
            ></uix-avatar>
          `)}
          ${count > 0 ? html`
            <div class="avatar placeholder">
              <div class="w-12 bg-neutral-focus text-neutral-content">
                <span>+${count}</span>
              </div>
            </div>
          ` : ""}
        </div>
      `;
    },
  },

  "uix-badge": {
    props: {
      content: { type: String, defaultValue: "" },
      variant: { 
        type: String,
        defaultValue: "default",
        enum: Variants
      },
      outline: { type: Boolean, defaultValue: false },
      size: { 
        type: String,
        defaultValue: "md",
        enum: ["lg", "md", "sm", "xs"]
      },
      icon: { type: String, defaultValue: null },
    },
    render: ({ content, variant, outline, size, icon }, { html }) => {
      const baseClass = "badge";
      const colorClass = `badge-${variant}${outline ? "-outline" : ""}`;
      const sizeClass = size !== "md" ? `badge-${size}` : "";
      const iconRender = icon ? html`<uix-icon name=${icon} class="w-4 h-4 mr-2"></uix-icon>` : "";

      return html`
        <span class="${baseClass} ${colorClass} ${sizeClass}">
          ${iconRender}
          ${content}
        </span>
      `;
    },
  },

  "uix-icon": {
    props: {
    },
    render: (props, { html }) => {
      console.log("NEED TO IMPLEMENT");
      return html`NEED TO IMPLEMENT`;
    }
  },
  "uix-alerts-container": { // TODO: create a container for alerts that knows how to close alert
    props: {
    },
    render: (props, { html }) => {
      console.log("NEED TO IMPLEMENT");
      return html`NEED TO IMPLEMENT`;
    }
  },
  "uix-breadcrumbs": {
    props: {
      items: { 
        type: Array, 
        defaultValue: [],
        format: [
          {
            label: String,
            href: String,
            icon: String // This will be a string referencing the icon name
          }
        ]
      },
      separator: { type: String, defaultValue: "/" }
    },
    render: ({ items, separator }, { html }) => {
      return html`
        <nav class="text-sm breadcrumbs">
          <ul>
            ${items.map(item => html`
              <li>
                ${item.icon ? html`<uix-icon name=${item.icon} class="w-4 h-4 mr-2"></uix-icon>` : ""}
                ${item.href ? html`<a href=${item.href}>${item.label}</a>` : item.label}
              </li>
              ${items.indexOf(item) !== items.length - 1 ? html`<li>${separator}</li>` : ""}
            `)}
          </ul>
        </nav>
      `;
    },
  },
  "uix-bottom-navigation": {
    props: {
      items: {
        type: Array,
        defaultValue: []
      },
      activeIndex: {
        type: Number,
        defaultValue: 0
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      }
    },
    render: ({ items, activeIndex, size }, { html }) => {
      const sizeClass = `btm-nav-${size}`;
      return html`
        <div class="btm-nav ${sizeClass}">
          ${items.map((item, index) => {
    const isActive = index === activeIndex;
    const activeClass = isActive ? "active" : "";
    const textColor = `text-${item.color}`;
    return html`
              <button class="${textColor} ${activeClass}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">${item.icon}</svg>
              </button>
            `;
  })}
        </div>
      `;
    }
  },
  "uix-button": {
    props: {
      variant: { 
        type: String,
        defaultValue: "base",
        enum: Variants
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      },
      fullWidth: { type: Boolean, defaultValue: false },
      shape: {
        type: String,
        defaultValue: "default",
        enum: Shapes
      },
      style: {
        type: String,
        defaultValue: "",
        enum: Styles
      },
      isLoading: { type: Boolean, defaultValue: false },
      startIcon: { type: String, defaultValue: "" },
      endIcon: { type: String, defaultValue: "" },
      noAnimation: { type: Boolean, defaultValue: false }
    },
    render: ({ variant, size, fullWidth, shape, style, isLoading, startIcon, endIcon, noAnimation }, { html }) => {
      const btnClass = `
        btn
        ${variant ? `btn-${variant}` : ""}
        ${size ? `btn-${size}` : ""}
        ${fullWidth ? "btn-block" : ""}
        ${shape ? `btn-${shape}` : ""}
        ${style ? `btn-${style}` : ""}
        ${noAnimation ? "no-animation" : ""}
      `;

      return html`
        <button class=${btnClass}>
          ${startIcon ? html`<svg class="h-6 w-6">${startIcon}</svg>` : ""}
          <slot></slot>
          ${endIcon ? html`<svg class="h-6 w-6">${endIcon}</svg>` : ""}
          ${isLoading ? html`<span class="loading loading-spinner"></span>` : ""}
        </button>
      `;
    }
  },
  "uix-card": {
    props: {
      title: { type: String, defaultValue: "Card Title" },
      subtitle: { type: String, defaultValue: "Subtitle" },
      content: { type: String, defaultValue: "Card Content" },
      image: { type: String, defaultValue: "" },
      footerContent: { type: String, defaultValue: "" },
      variant: { type: String, defaultValue: "base-100", enum: Variants },
      compact: { type: Boolean, defaultValue: false },
      bordered: { type: Boolean, defaultValue: false },
      sideImage: { type: Boolean, defaultValue: false },
      centeredContent: { type: Boolean, defaultValue: false },
      imageOverlay: { type: Boolean, defaultValue: false }
    },
    render: ({ title, subtitle, content, image, footerContent, variant, compact, bordered, sideImage, centeredContent, imageOverlay }, { html }) => {
      const bgClass = `bg-${variant}`;
      const textColorClass = variant === "base-100" ? "" : `text-${variant}-content`;
      const compactClass = compact ? "card-compact" : "";
      const borderedClass = bordered ? "card-bordered" : "";
      const sideImageClass = sideImage ? "card-side" : "";
      const centeredContentClass = centeredContent ? "items-center text-center" : "";
      const imageOverlayClass = imageOverlay ? "image-full" : "";
  
      return html`
          <div class="card ${bgClass} ${textColorClass} ${compactClass} ${borderedClass} ${sideImageClass} ${imageOverlayClass} shadow-xl">
            ${image ? html`
              <figure><img src=${image} alt="Card Image" /></figure>
            ` : ""}
            <div class="card-body ${centeredContentClass}">
              <h2 class="card-title">${title}</h2>
              ${subtitle ? html`<h3 class="subtitle">${subtitle}</h3>` : ""}
              <p>${content}</p>
              ${footerContent ? html`
                <div class="justify-end card-actions">
                  ${footerContent}
                </div>
              ` : ""}
            </div>
          </div>
        `;
    },
  },  
  "uix-carousel": {
    props: {
      items: {
        type: Array,
        defaultValue: []
      },
      alignment: {
        type: String,
        defaultValue: "start",
        enum: ["start", "center", "end"]
      },
      orientation: {
        type: String,
        defaultValue: "horizontal",
        enum: ["horizontal", "vertical"]
      },
      indicatorButtons: {
        type: Boolean,
        defaultValue: false
      },
      navigationButtons: {
        type: Boolean,
        defaultValue: false
      }
    },
    render: ({ items, alignment, orientation, indicatorButtons, navigationButtons }, { html }) => {
      const orientationClass = orientation === "vertical" ? "carousel-vertical" : "";
      const alignmentClass = `carousel-${alignment}`;
      let carouselItems = items.map((item, index) => {
        return html`
          <div id="item${index}" class="carousel-item">
            <img src=${item.src} alt=${item.alt} />
            ${navigationButtons ? html`
              <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#item${index-1}" class="btn btn-circle">❮</a>
                <a href="#item${index+1}" class="btn btn-circle">❯</a>
              </div>
            ` : ""}
          </div>
        `;
      });

      return html`
        <div class="carousel ${alignmentClass} ${orientationClass} rounded-box">
          ${carouselItems}
        </div>
        ${indicatorButtons ? html`
          <div class="flex justify-center w-full py-2 gap-2">
            ${items.map((_, index) => html`<a href="#item${index}" class="btn btn-xs">${index+1}</a>`)}
          </div>
        ` : ""}
      `;
    },
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
      }
    },
    render: ({ message, sender, alignment, variant }, { html }) => {
      const bgColorClass = `chat-bubble-${variant}`;
      return html`
        <div class="chat chat-${alignment}">
          ${sender.avatar ? html`
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
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
  "uix-checkbox": {
    props: {
      checked: { type: Boolean, defaultValue: false },
      indeterminate: { type: Boolean, defaultValue: false },
      variant: {
        type: String,
        defaultValue: "default",
        enum: Variants
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      },
      label: { type: String, defaultValue: "Checkbox" },
      disabled: { type: Boolean, defaultValue: false },
      change: { type: Function }
    },
    render: ({ checked, indeterminate, change, label, disabled, variant, size }, { html }) => {
      // Handle the indeterminate state.
      const postRender = (el) => {
        const inputEl = el.querySelector("input[type=\"checkbox\"]");
        if (inputEl) inputEl.indeterminate = indeterminate;
      };
      
      return html`
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">${label}</span>
            <input 
              type="checkbox" 
              @change=${change} 
              ?checked=${checked} 
              ?disabled=${disabled} 
              class="checkbox checkbox-${variant} checkbox-${size}"
              @postRender=${postRender}
            >
          </label>
        </div>
      `;
    },
  },
  "uix-collapse": {
    props: {
      method: { type: String, defaultValue: "focus", enum: ["focus", "checkbox", "details"] }, // Method of collapsing.
      variant: { type: String, defaultValue: "base", enum: Variants }, // Color variant.
      title: { type: String, defaultValue: "Click to open/close" }, // Title of the collapse.
      content: { type: String, defaultValue: "Collapse Content" }, // Content of the collapse.
      icon: { type: String, defaultValue: "", enum: ["", "arrow", "plus"] }, // Icon for the collapse (if any).
      isOpen: { type: Boolean, defaultValue: false }, // Determines if the collapse is initially open or closed.
    },
    render: ({ method, variant, title, content, icon, isOpen }, { html }) => {
      const baseClass = `collapse bg-${variant}-200`;
      const iconClass = icon ? `collapse-${icon}` : "";
      const openClass = isOpen ? "collapse-open" : "";
      
      if(method === "focus") {
        return html`
          <div tabindex="0" class="${baseClass} ${iconClass} ${openClass}">
            <div class="collapse-title text-xl font-medium">${title}</div>
            <div class="collapse-content">${content}</div>
          </div>
        `;
      } else if(method === "checkbox") {
        return html`
          <div class="${baseClass}">
            <input type="checkbox" class="peer" />
            <div class="collapse-title text-xl font-medium ${iconClass}">${title}</div>
            <div class="collapse-content">${content}</div>
          </div>
        `;
      } else {
        return html`
          <details class="${baseClass}">
            <summary class="collapse-title text-xl font-medium">${title}</summary>
            <div class="collapse-content">${content}</div>
          </details>
        `;
      }
    },
  },
  "uix-kbd": {
    props: {
      keyContent: { type: String, defaultValue: "Key" },
      size: { 
        type: String,
        defaultValue: "md",
        enum: Sizes
      },
    },
    render: ({ keyContent, size }, { html }) => {
      const sizeClassMap = {
        lg: "text-lg px-3 py-2",
        md: "text-md px-2 py-1", // default
        sm: "text-sm px-1 py-0.5",
        xs: "text-xs px-0.5 py-0.25"
      };
      const sizeClasses = sizeClassMap[size];
      const kbdClass = `bg-primary-200 rounded ${sizeClasses}`;
      return html`<kbd class=${kbdClass}>${keyContent}</kbd>`;
    },
  },

  "uix-countdown": {
    props: {
      endDate: { type: String, defaultValue: "YYYY-MM-DD HH:MM:SS" },
      format: {
        type: String,
        defaultValue: "DHMS",
        enum: Formats
      }
    },
    render: ({ endDate, format }, { html }) => {
      const calculateCountdown = (end) => {
        const now = new Date();
        const endDateTime = new Date(end);
        const diff = endDateTime - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
        return { days, hours, minutes, seconds };
      };

      const countdown = calculateCountdown(endDate);

      const formattedCountdown = format.split("").map(f => {
        switch(f) {
        case "D": return html`<span class="font-mono text-4xl countdown"><span style="--value:${countdown.days};"></span>days</span>`;
        case "H": return html`<span class="font-mono text-4xl countdown"><span style="--value:${countdown.hours};"></span>hours</span>`;
        case "M": return html`<span class="font-mono text-4xl countdown"><span style="--value:${countdown.minutes};"></span>minutes</span>`;
        case "S": return html`<span class="font-mono text-4xl countdown"><span style="--value:${countdown.seconds};"></span>seconds</span>`;
        default: return "";
        }
      });

      return html`
      <div class="countdown">
        ${formattedCountdown}
      </div>
    `;
    }
  },
  "uix-divider": {
    props: {
      thickness: { type: String, defaultValue: "1px" },
      color: { 
        type: String, 
        defaultValue: "primary",
        enum: Variants,
      },
      text: { type: String, defaultValue: "" }, 
      direction: {
        type: String,
        defaultValue: "vertical",
        enum: Directions
      },
      responsiveDirection: {
        type: String,
        defaultValue: "",
        enum: Directions
      }
    },
    
    render: ({ thickness, color, text, direction, responsiveDirection }, { html }) => {
      const baseClass = `divider ${direction === "horizontal" ? "divider-horizontal" : ""}`;
      const responsiveClass = responsiveDirection ? `lg:divider-${responsiveDirection}` : "";
      const colorClass = `bg-${color}-focus`;
    
      return html`
          <div class="${baseClass} ${responsiveClass} ${colorClass}" style="height: ${thickness};">
            ${text}
          </div>
        `;
    },
  },    
  "uix-drawer": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      position: {
        type: String,
        defaultValue: "left",
        enum: Positions
      },
      setIsOpen: {
        type: Function,
        defaultValue: null
      }
    },
    render: ({ isOpen, position, setIsOpen }, { html }) => {
      const positionClass = position === "right" ? "drawer-end" : "";
      const toggleDrawer = () => {
        if (setIsOpen) {
          setIsOpen(!isOpen);
        }
      };

      return html`
        <div class="drawer ${positionClass}">
          <input 
            id="uix-drawer-toggle" 
            type="checkbox" 
            class="drawer-toggle" 
            ?checked=${isOpen} 
            @change=${toggleDrawer} />
          <div class="flex flex-col items-center justify-center drawer-content">
            <label for="uix-drawer-toggle" class="btn btn-primary drawer-button" @click=${toggleDrawer}>
              <uix-icon name="menu" class="w-4 h-4 mr-2"></uix-icon>
              Open drawer
            </label>
          </div> 
          <div class="drawer-side h-full absolute">
            <label for="uix-drawer-toggle" class="drawer-overlay" @click=${toggleDrawer}></label>
            <slot></slot>
          </div>
        </div>
      `;
    },
  },
  "uix-dropdown": {
    props: {
      label: { type: String, defaultValue: "Click" },
      items: { type: Array, defaultValue: [] },
      variant: { 
        type: String,
        defaultValue: "base",
        enum: Variants
      },
      method: {
        type: String,
        defaultValue: "focus",
        enum: Methods
      },
      position: {
        type: String,
        defaultValue: "bottom",
        enum: Positions
      },
      isOpen: { type: Boolean, defaultValue: false },
      openOnHover: { type: Boolean, defaultValue: false },
      forceOpen: { type: Boolean, defaultValue: false }
    },
    render: ({ label, items, variant, method, position, isOpen, openOnHover, forceOpen, setIsOpen }, { html }) => {
      const bgColorClass = `bg-${variant}-100`;
      const textColorClass = `text-${variant}-content`;

      return html`
        <div class="dropdown ${position === "end" ? "dropdown-end" : ""} ${openOnHover ? "dropdown-hover" : ""} ${forceOpen ? "dropdown-open" : ""}">
          ${method === "details" ? html`
            <details class="${bgColorClass} ${textColorClass} mb-32">
              <summary class="m-1 btn">${label}</summary>
              <ul class="p-2 shadow menu dropdown-content z-[1] ${bgColorClass} rounded-box w-52">
                ${items.map(item => html`<li><a>${item}</a></li>`)}
              </ul>
            </details>
          ` : html`
            <label tabindex="0" class="m-1 btn" @click=${()=> setIsOpen(!isOpen)}>${label}</label>
            ${isOpen ? html`
              <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] ${bgColorClass} rounded-box w-52">
                ${items.map(item => html`<li><a>${item}</a></li>`)}
              </ul>
            ` : ""}
          `}
        </div>
      `;
    },
  },
  "uix-modal": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      title: { type: String, defaultValue: "Modal Title" },
      content: { type: String, defaultValue: "Modal Content" },
      closable: { type: Boolean, defaultValue: true },
      position: { type: String, defaultValue: "middle", enum: ["top", "middle", "bottom"] },
      icon: { type: String, defaultValue: "" },
    },
    render: ({ isOpen, title, content, closable, setIsOpen, position, icon }, { html }) => {
      const modalClass = `modal ${ModalPositions[position] || ModalPositions.middle}`;
  
      return html`
        <dialog class=${modalClass} ?open=${isOpen}>
          ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
          <div class="modal-title">${title}</div>
          <div class="modal-content">${content}</div>
          ${closable ? html`<uix-button @click=${() => setIsOpen(false)}>Close</uix-button>` : ""}
        </dialog>
      `;
    },
  },  
  "uix-link": {
    props: {
      href: { type: String, defaultValue: "#" },
      content: { type: String, defaultValue: "Link" },
      external: { type: Boolean, defaultValue: false },
    },
    render: ({ href, content, external }, { html }) => {
      return html`<a href=${href} class="text-primary-500 hover:underline" ${external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${content}</a>`;
    },
  },
      
      
  "uix-hero": {
    props: {
      title: { type: String, defaultValue: "Hero Title" },
      subtitle: { type: String, defaultValue: "Subtitle" },
      backgroundImage: { type: String, defaultValue: "" },
    },
    render: ({ title, subtitle, backgroundImage }, { html }) => {
      const heroClass = backgroundImage ? "bg-cover bg-center" : "bg-primary-200";
      return html`
              <div class=${heroClass} style="background-image: url('${backgroundImage}');">
                <div class="text-center p-10">
                  <h1 class="text-4xl font-bold text-primary-700">${title}</h1>
                  <p class="text-xl text-primary-600">${subtitle}</p>
                </div>
              </div>
            `;
    },
  },

  "uix-toggle": {
    props: {
      on: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: "Toggle" },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ on, label, disabled }, { html }) => {
      return html`
        <label class="flex items-center">
          <input type="checkbox" ?checked=${on} ?disabled=${disabled} class="toggle">
          <span class="ml-2">${label}</span>
        </label>
      `;
    },
  },

  "uix-mask": {
    props: {
      content: { type: String, defaultValue: "Masked Content" }
    },
    render: ({ content }, { html }) => {
      // Placeholder for masked content, you can expand on this using CSS or JS masking techniques
      return html`<div class="masked">${content}</div>`;
    },
  },
  "uix-radio": {
    props: {
      selectedValue: { type: String, defaultValue: "" },
      options: { type: Array, defaultValue: [] },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ selectedValue, options, disabled }, { html }) => {
      return html`
        ${options.map(option => html`
          <label class="inline-flex items-center">
            <input type="radio" class="form-radio" name="radios" value=${option} .checked="${selectedValue === option}" ?disabled=${disabled}>
            <span class="ml-2">${option}</span>
          </label>
        `)}
      `;
    },
  },

  "uix-tooltip": {
    props: {
      content: { type: String, defaultValue: "Tooltip Content" },
      position: { type: String, defaultValue: "top", enum: Directions },
      trigger: { type: String, defaultValue: "hover", enum: Triggers }
    },
    render: ({ content, position, trigger }, { html }) => {
      // Implementation will vary based on how you're using DaisyUI for tooltips.
      // Below is a conceptual example.
      return html`
        <span data-tooltip=${content} data-tooltip-position=${position} data-tooltip-trigger=${trigger}>
          ${content}
        </span>
      `;
    },
  },

  "uix-toast": {
    props: {
      message: { type: String, defaultValue: "Toast Message" },
      duration: { type: Number, defaultValue: 3000 },
      position: { type: String, defaultValue: "top-right", enum: Positions },
      variant: { type: String, defaultValue: "default", enum: Variants }
    },
    render: ({ message, duration, position, variant }, { html }) => {
      // Toasts typically are dynamic and might require JavaScript to be displayed/hidden.
      // Below is a basic structure.
      return html`
        <div class="toast toast-${position} toast-${variant}" style="animation-duration: ${duration}ms;">
          ${message}
        </div>
      `;
    },
  },

  "uix-input": {
    props: {
      value: { type: String, defaultValue: "" },
      placeholder: { type: String, defaultValue: "Enter value" },
      disabled: { type: Boolean, defaultValue: false },
      type: { type: String, defaultValue: "text", enum: ["text", "password", "email", "number", "search"] },
      maxLength: { type: Number, defaultValue: null },
      keyup: { type: Function }
    },
    render: ({ value, keyup, placeholder, disabled, type, maxLength }, { html }) => {      
      return html`
        <input class="input input-${type}"
        @keyup=${keyup}
        .value=${value || ""}
        placeholder=${placeholder} ?disabled=${disabled} type=${type} ${maxLength !== null ? `maxlength=${maxLength}` : ""}>
      `;
    },
  },

  
  "uix-textarea": {
    props: {
      value: { type: String, defaultValue: "" },
      placeholder: { type: String, defaultValue: "Enter text" },
      disabled: { type: Boolean, defaultValue: false },
      rows: { type: Number, defaultValue: 4 }
    },
    render: ({ value, placeholder, disabled, rows }, { html }) => {
      return html`<textarea placeholder=${placeholder} ?disabled=${disabled} rows=${rows}>${value}</textarea>`;
    },
  },
  "uix-file-input": {
    props: {
      acceptedTypes: { type: String, defaultValue: "*/*" },
      multiple: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: "Choose File" }
    },
    render: ({ acceptedTypes, multiple, label }, { html }) => {
      return html`<input type="file" accept=${acceptedTypes} ?multiple=${multiple} class="bg-neutral p-2 rounded" aria-label=${label} />`;
    },
  },

  "uix-range-slider": {
    props: {
      min: { type: Number, defaultValue: 0 },
      max: { type: Number, defaultValue: 100 },
      step: { type: Number, defaultValue: 1 },
      value: { type: Number, defaultValue: 50 }
    },
    render: ({ min, max, step, value }, { html }) => {
      return html`<input type="range" min=${min} max=${max} step=${step} value=${value} class="bg-neutral p-2 rounded" />`;
    },
  },

  "uix-select": {
    props: {
      options: { type: Array, defaultValue: [] },
      selectedValue: { type: String, defaultValue: "" },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ options, selectedValue, disabled }, { html }) => {
      return html`
        <select ?disabled=${disabled} class="form-select">
          ${options.map(option => html`<option value=${option} ?selected="${option === selectedValue}">${option}</option>`)}
        </select>
      `;
    },
  },

  "uix-input-group": {
    props: {
      label: { type: String, defaultValue: "Group Label" },
      direction: { type: String, defaultValue: "horizontal", enum: Directions }
    },
    render: ({ label, direction }, { html }) => {
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      return html`<div class="flex ${directionClass}"><label class="font-bold">${label}</label><slot></slot></div>`;
    },
  },

  "uix-rating": {
    props: {
      maxValue: { type: Number, defaultValue: 5 },
      value: { type: Number, defaultValue: 0 }
    },
    render: ({ maxValue, value }, { html }) => {
      return html`
        ${Array.from({ length: maxValue }).map((_, index) => 
    html`<span class="text-${index < value ? "primary" : "neutral"}">★</span>`
  )}
      `;
    },
  },

  "uix-artboard": {
    props: {
      content: { type: String, defaultValue: "Artboard Content" },
      size: { type: Number, defaultValue: 1, enum: [1,2,3,4,5,6] },
      horizontal: { type: Boolean, defaultValue: false }
    },
    render: ({ content, size, horizontal }, { html }) => {
      const sizeClass = `phone-${size}`;
      const orientationClass = horizontal ? "artboard-horizontal" : "";
      return html`<div class="artboard ${sizeClass} ${orientationClass}">${content}</div>`;
    },
  },

  "uix-stack": {
    props: {
      direction: { type: String, defaultValue: "vertical", enum: Directions },
      spacing: { type: String, defaultValue: "default" }
    },
    render: ({ direction, spacing }, { html }) => {
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      return html`<div class="flex ${directionClass} space-${spacing}"><slot></slot></div>`;
    },
  },

  "uix-join": {
    props: {
      direction: { type: String, defaultValue: "vertical", enum: Directions }
    },
    render: ({ direction }, { html }) => {
      const directionClass = direction === "horizontal" ? "flex flex-row" : "flex flex-col";
      return html`<div class=${directionClass}><slot></slot></div>`;
    },
  },
  
  "uix-navbar": {
    props: {
      items: { type: Array, defaultValue: [] },
      position: { type: String, defaultValue: "top" },
      sticky: { type: Boolean, defaultValue: false }
    },
    render: ({ items, position, sticky }, { html }) => {
      return html`
        <nav class="navbar-${position} ${sticky ? "sticky" : ""}">
          ${items.map(item => html`<uix-button label=${item.label} variant=${item.variant}></uix-button>`)}
        </nav>
      `;
    },
  },
  "uix-footer": {
    props: {
      content: { type: String, defaultValue: "Footer Content" }
    },
    render: ({ content }, { html }) => {
      return html`
        <footer class="bg-neutral p-4">${content}</footer>
      `;
    },
  },


  "uix-tabs": {
    props: {
      items: { type: Array, defaultValue: [] },
      selectedValue: { type: String, defaultValue: "" }
    },
    render: ({ items, selectedValue }, { html }) => {
      return html`
        <div class="tabs">
          ${items.map(item => html`
            <uix-button label=${item.label} variant=${item.value === selectedValue ? "active" : "default"}></uix-button>
          `)}
          <!-- Corresponding tab contents can be rendered here -->
        </div>
      `;
    },
  },

  "uix-pagination": {
    props: {
      currentPage: { type: Number, defaultValue: 1 },
      totalPages: { type: Number, defaultValue: 10 }
    },
    render: ({ currentPage, totalPages }, { html }) => {
      // Basic pagination logic, can be improved based on use case
      return html`
        <div class="pagination">
          ${Array.from({ length: totalPages }).map((_, idx) => html`<uix-button label=${idx + 1} variant=${idx + 1 === currentPage ? "primary" : "neutral"}></uix-button>`)}
        </div>
      `;
    },
  },

  "uix-browser-mockup": {
    props: {
      url: { type: String, defaultValue: "https://example.com" },
      content: { type: String, defaultValue: "Browser Content" }
    },
    render: ({ url, content }, { html }) => {
      return html`
        <div class="browser-mockup">
          <div class="url-bar">${url}</div>
          <div class="content">${content}</div>
        </div>
      `;
    },
  },

  "uix-code-mockup": {
    props: {
      code: { type: String, defaultValue: "Example code" },
      language: { type: String, defaultValue: "html" }
    },
    render: ({ code, language }, { html }) => {
      // Syntax highlighting and other features can be implemented based on the 'language' prop.
      return html`
        <pre class="code-mockup">${code}</pre>
      `;
    },
  },

  "uix-phone-mockup": {
    props: {
      content: { type: String, defaultValue: "Phone Content" }
    },
    render: ({ content }, { html }) => {
      return html`
        <div class="phone-mockup">${content}</div>
      `;
    },
  },

  "uix-window-mockup": {
    props: {
      title: { type: String, defaultValue: "Window Title" },
      content: { type: String, defaultValue: "Window Content" }
    },
    render: ({ title, content }, { html }) => {
      return html`
        <div class="window-mockup">
          <div class="title">${title}</div>
          <div class="content">${content}</div>
        </div>
      `;
    },
  },

  "uix-menu": {
    props: {
      items: { type: Array, defaultValue: [] },
      horizontal: { type: Boolean, defaultValue: false }
    },
    render: ({ items, horizontal }, { html }) => {
      return html`
        <ul class="menu ${horizontal ? "horizontal" : "vertical"}">
          ${items.map(item => html`<li><a href=${item.href}>${item.label}</a></li>`)}
        </ul>
      `;
    },
  },

  "uix-progress": {
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, maxValue, variant }, { html }) => {
      return html`
        <progress class="progress progress-${variant} w-56" value=${value} max=${maxValue}></progress>
      `;
    },
  },

  "uix-radial-progress": {
    // Placeholder for radial progress. Adjust accordingly for real implementation.
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, maxValue, variant }, { html }) => {
      return html`
        <progress class="progress progress-${variant} w-56" value=${value} max=${maxValue}></progress>
      `;
    },
  },

  "uix-table": {
    props: {
      columns: { type: Array, defaultValue: [] },
      data: { type: Array, defaultValue: [] },
      striped: { type: Boolean, defaultValue: false },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ columns, data, striped, variant }, { html }) => {
      const tableClass = striped ? `table table-striped table-${variant}` : `table table-${variant}`;
      return html`
        <table class=${tableClass}>
          <thead>
            <tr>
              ${columns.map(column => html`<th>${column}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => html`
              <tr>
                ${row.map(cell => html`<td>${cell}</td>`)}
              </tr>
            `)}
          </tbody>
        </table>
      `;
    },
  },

  "uix-steps": {
    props: {
      steps: { type: Array, defaultValue: [] },
      currentStep: { type: Number, defaultValue: 1 },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ steps, currentStep, variant }, { html }) => {
      return html`
        <div class="steps">
          ${steps.map((step, index) => {
    const stepClass = (index + 1) === currentStep ? `step step-${variant}` : "step";
    return html`<div class=${stepClass}>${step}</div>`;
  })}
        </div>
      `;
    },
  },

  "uix-swap": {
    props: {
      value: { type: String, defaultValue: "" },
      swapValue: { type: String, defaultValue: "" },
      labelA: { type: String, defaultValue: "A" },
      labelB: { type: String, defaultValue: "B" },
      variant: { type: String, defaultValue: "primary", enum: Variants }
    },
    render: ({ value, swapValue, labelA, labelB, variant }, { html }) => {
      return html`
        <div class="p-4 space-x-2">
          <label>${labelA}: <input class="input input-bordered input-${variant}" type="text" value=${value}></label>
          <label>${labelB}: <input class="input input-bordered input-${variant}" type="text" value=${swapValue}></label>
        </div>
      `;
    },
  }, 

  "uix-modal": {
    props: {
      isOpen: { type: Boolean, defaultValue: false },
      title: { type: String, defaultValue: "Modal Title" },
      content: { type: String, defaultValue: "Modal Content" },
      closable: { type: Boolean, defaultValue: true }
    },
    render: ({ isOpen, title, content, closable, setIsOpen }, { html }) => {
      return html`
        <div class="modal" ?open=${isOpen}>
          <div class="modal-title">${title}</div>
          <div class="modal-content">${content}</div>
          ${closable ? html`<uix-button @click=${() => setIsOpen(false)}>Close</uix-button>` : ""}
        </div>
      `;
    },
  },

  "uix-loading": {
    props: {
      isVisible: { type: Boolean, defaultValue: false },
      message: { type: String, defaultValue: "Loading..." }
    },
    render: ({ isVisible, message }, { html }) => {
      return isVisible ? html`<div class="loading">${message}</div>` : html``;
    },
  },

  "uix-indicator": {
    props: {
      value: { type: Number, defaultValue: 0 },
      maxValue: { type: Number, defaultValue: 100 },
      format: {
        type: String,
        defaultValue: "percentage",
        enum: IndicatorsFormat}
    },
    render: ({ value, maxValue, format }, { html }) => {
      const percentageValue = (value / maxValue) * 100;
      const displayValue = format === "percentage" ? `${percentageValue}%` : `${value}/${maxValue}`;
      return html`
        <div class="indicator">
          <div class="indicator-bar" style="width: ${percentageValue}%;"></div>
          <span>${displayValue}</span>
        </div>
      `;
    },
  },

  "uix-stat": {
    props: {
      number: { type: String, defaultValue: "0" },
      description: { type: String, defaultValue: "Description" },
      color: {
        type: String,
        defaultValue: "default",
        enum: Variants        
      },
    },
    render: ({ number, description, color }, { html }) => {
      const numberClass = `text-${color}-content font-bold text-4xl`;
      const descClass = `text-${color}-content text-lg mt-2`;

      return html`
        <div class="p-4">
          <div class=${numberClass}>${number}</div>
          <div class=${descClass}>${description}</div>
        </div>
      `;
    },
  },
};
      