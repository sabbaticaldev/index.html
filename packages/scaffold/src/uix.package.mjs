const BgOverlayOpacity = {
  10: "bg-opacity-10",
  20: "bg-opacity-20",
  30: "bg-opacity-30",
  40: "bg-opacity-40",
  50: "bg-opacity-50",
  60: "bg-opacity-60",
  70: "bg-opacity-70",
  80: "bg-opacity-80",
  90: "bg-opacity-90",
  100: "bg-opacity-100",
};

const DirectionsClasses = {
  "horizontal": "divider-horizontal",
  "vertical": ""
};




const Positions = ["start", "center", "end", "top", "middle", "bottom", "top", "end", "bottom", "middle", "left", "right", "top-right", "top-left", "bottom-right", "bottom-left"];
const Resolutions = ["sm", "md", "lg", "xl"];
const NavbarPart = ["start", "center", "end"];
const Layouts = ["default", "responsive"];
const Spacings = ["none", "xs", "sm", "md", "lg", "xl", "2xl"];
const AnimationTypes = ["spinner", "dots", "ring", "ball", "bars", "infinity"];
const ModalPositions = {
  "top": "modal-top",
  "middle": "modal-middle",
  "bottom": "modal-bottom",
};
const Methods = ["details", "focus"];
const Sizes = ["lg", "md", "sm", "xs"];
const Shapes = ["default", "circle", "square"];
const Styles = ["ghost", "link", "outline", "glass", "active", "disabled", "bordered"];
const Triggers = ["click", "hover"];
const Directions = ["horizontal", "vertical"];
const Formats = ["DHMS", "HMS", "MS", "S"];
const Variants = ["primary", "secondary", "accent", "neutral", "base", "info", "success", "warning", "error"];
const BgColor = {
  "primary": "bg-primary-200",
  "secondary": "bg-secondary-200",
  "accent": "bg-accent-200",
  "neutral": "bg-neutral-200",
  "base": "bg-base-200",
  "info": "bg-info-200",
  "success": "bg-success-200",
  "warning": "bg-warning-200",
  "error": "bg-error-200"
};
const CheckboxVariant = {
  "default": "checkbox-default",
  "primary": "checkbox-primary",
  "secondary": "checkbox-secondary",
  "accent": "checkbox-accent",
  "neutral": "checkbox-neutral",
  "base": "checkbox-base",
  "info": "checkbox-info",
  "success": "checkbox-success",
  "warning": "checkbox-warning",
  "error": "checkbox-error"
};

const CheckboxSize = {
  "lg": "checkbox-lg",
  "md": "checkbox-md",
  "sm": "checkbox-sm",
  "xs": "checkbox-xs"
};

const CollapseBgColor = {
  "primary": "bg-primary-200",
  "secondary": "bg-secondary-200",
  "accent": "bg-accent-200",
  "neutral": "bg-neutral-200",
  "base": "bg-base-200",
  "info": "bg-info-200",
  "success": "bg-success-200",
  "warning": "bg-warning-200",
  "error": "bg-error-200"
};

const CollapseIcon = {
  "": "",
  "arrow": "collapse-arrow",
  "plus": "collapse-plus"
};
const TextColor = {
  "primary": "text-primary-focus",
  "secondary": "text-secondary-focus",
  "accent": "text-accent-focus",
  "neutral": "text-neutral-focus",
  "base": "text-base-focus",
  "info": "text-info-focus",
  "success": "text-success-focus",
  "warning": "text-warning-focus",
  "error": "text-error-focus"
};

const BorderColor = {
  "primary": "border-primary-content",
  "secondary": "border-secondary-content",
  "accent": "border-accent-content",
  "neutral": "border-neutral-content",
  "base": "border-base-content",
  "info": "border-info-content",
  "success": "border-success-content",
  "warning": "border-warning-content",
  "error": "border-error-content"
};

const RingColor = {
  "primary": "ring-primary",
  "secondary": "ring-secondary",
  "accent": "ring-accent",
  "neutral": "ring-neutral",
  "base": "ring-base",
  "info": "ring-info",
  "success": "ring-success",
  "warning": "ring-warning",
  "error": "ring-error"
};

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
      const colorClass = `${BgColor[variant]} ${BorderColor[variant]} ${TextColor[variant]}`;
    
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
      const ringClass = hasRing ? `${RingColor[ringColor]} ring-offset-base-100 ring-offset-2` : "";
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
      const colorClass = BgColor[variant] + (outline ? "-outline" : ""); 
      const sizeClassMapping = {
        "lg": "badge-lg",
        "md": "",
        "sm": "badge-sm",
        "xs": "badge-xs"
      };
      const sizeClass = sizeClassMapping[size];

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
    render: ({ content, variant, outline, size, icon }, { html }) => {
      const BadgeSizes = {
        "lg": "badge-lg",
        "md": "",
        "sm": "badge-sm",
        "xs": "badge-xs"
      };
      const baseClass = "badge";
      const colorClass = BgColor[variant] + (outline ? "-outline" : "");
      const sizeClass = BadgeSizes[size];
      const iconRender = icon ? html`<uix-icon name=${icon} class="w-4 h-4 mr-2"></uix-icon>` : "";

      return html`
        <span class="${baseClass} ${colorClass} ${sizeClass}">
          ${iconRender}
          ${content}
        </span>
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
      const BtmClasses = {
        "md": "btm-nav-md",
        "sm": "btm-nav-sm",
        "lg": "btm-nav-lg",
        "xl": "btm-nav-xl"
      };
      const sizeClass = BtmClasses[size];

      return html`
        <div class="btm-nav ${sizeClass}">
          ${items.map((item, index) => {
    const isActive = index === activeIndex;
    const activeClass = isActive ? "active" : "";
    const textColor = TextColor[item.color];
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
      color: { 
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
      variant: {
        type: String,
        defaultValue: "",
        enum: Styles
      },
      isLoading: { type: Boolean, defaultValue: false },
      startIcon: { type: String, defaultValue: "" },
      endIcon: { type: String, defaultValue: "" },
      noAnimation: { type: Boolean, defaultValue: false }
    },
    render: ({ color, size, fullWidth, shape, variant, isLoading, startIcon, endIcon, noAnimation }, { html }) => {
      const ButtonColors = {
        ...BgColor,
        ...TextColor,
        ...BorderColor
      };

      const ButtonSizes = {
        "lg": "btn-lg",
        "md": "",
        "sm": "btn-sm",
        "xs": "btn-xs"
      };

      const ButtonShapes = {
        "default": "",
        "circle": "btn-circle",
        "square": "btn-square"
      };

      const ButtonVariants = {
        "ghost": "btn-ghost",
        "link": "btn-link",
        "outline": "btn-outline",
        "glass": "btn-glass",
        "active": "btn-active",
        "disabled": "btn-disabled",
        "bordered": "btn-bordered"
      };

      const btnClass = `
        btn

        ${ButtonColors[color] || ""}
        ${ButtonSizes[size] || ""}
        ${fullWidth ? "btn-block" : ""}
        ${ButtonShapes[shape] || ""}
        ${ButtonVariants[variant] || ""}
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
      const bgClass = BgColor[variant];
      const textColorClass = variant === "base-100" ? "" : TextColor[variant];
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
      const OrientationClasses = {
        "horizontal": "",
        "vertical": "carousel-vertical"
      };
  
      const AlignmentClasses = {
        "start": "carousel-start",
        "center": "carousel-center",
        "end": "carousel-end"
      };
  
      const alignmentClass = AlignmentClasses[alignment];
      const orientationClass = OrientationClasses[orientation];
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
      const variantClass = CheckboxVariant[variant];
      const sizeClass = CheckboxSize[size];

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
            class="checkbox ${variantClass} ${sizeClass}"
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
      const baseClass = `collapse ${CollapseBgColor[variant]}`;
      const iconClass = CollapseIcon[icon];
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
      const baseClass = `divider ${DirectionsClasses[direction]}`;
      const responsiveClass = responsiveDirection ? `lg:divider-${responsiveDirection}` : "";
      const colorClass = BgColor[color];
    
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
      const bgColorClass = BgColor[variant];
      const textColorClass = TextColor[variant];
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
  "uix-mask": {
    props: {
      variant: { type: String, defaultValue: "squircle" },
      src: String
    },
    render: ({ variant, src }, { html }) => {
      // Placeholder for masked content, you can expand on this using CSS or JS masking techniques
      return html`<img class="mask ${variant}" src=${src} />`;
    },
  },
  "uix-loading": {
    props: {
      isVisible: { type: Boolean, defaultValue: false },
      message: { type: String, defaultValue: null },
      type: { 
        type: String, 
        defaultValue: "spinner",
        enum: AnimationTypes
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      },
      color: {
        type: String,
        defaultValue: "primary",
        enum: Variants
      }
    },
    render: ({ isVisible, message, type, size, color }, { html }) => {
      if (!isVisible) return html``;
      const Loading = {
        "spinner": "loading loading-spinner",
        "dots": "loading loading-dots",
        "ring": "loading loading-ring",
        "ball": "loading loading-ball",
        "bars": "loading loading-bars",
        "infinity": "loading loading-infinity"
      };
      const LoadingSize = {
        "lg": "loading-lg",
        "md": "loading-md",
        "sm": "loading-sm",
        "xs": "loading-xs"
      };
      
      const loadingClass = `${Loading[type]} ${LoadingSize[size]} ${TextColor[color]}`;

      return html`
        <span class="${loadingClass}">
          ${message ? html`<span>${message}</span>` : ""}
          ${message && type === "spinner" ? html`<uix-icon name="spinner"></uix-icon>` : ""}
        </span>
      `;
    },
  },
  "uix-menu": {
    props: {
      items: { type: Array, defaultValue: [] },
      title: { type: String, defaultValue: null },
      variant: { type: String, defaultValue: "base", enum: Variants },
      orientation: { type: String, defaultValue: "vertical", enum: ["vertical", "horizontal"] },
      size: { type: String, defaultValue: "md", enum: ["xs", "sm", "md", "lg"] },
      isActive: { type: Boolean, defaultValue: false },
      isCollapsible: { type: Boolean, defaultValue: false },
      withIcon: { type: Boolean, defaultValue: false },
      iconOnly: { type: Boolean, defaultValue: false },
    },
    render: ({ items, title, variant, orientation, size, isActive, isCollapsible, withIcon, iconOnly }, { html }) => {
      const MenuSize = {
        "lg": "menu-lg",
        "md": "menu-md",
        "sm": "menu-sm",
        "xs": "menu-xs"
      };
      
      const baseClass = `menu ${orientation === "horizontal" ? "menu-horizontal" : ""} rounded-box`;
      const bgColorClass = BgColor[variant];
      const sizeClass = MenuSize[size];
      const activeClass = isActive ? "active" : "";
      const iconClass = withIcon ? "<uix-icon></uix-icon>" : "";

      return html`
        <ul class="${baseClass} ${sizeClass} ${bgColorClass}">
          ${title ? html`<li class="menu-title">${title}</li>` : ""}
          ${items.map(item => {
    if (isCollapsible) {
      return html`
                <details open>
                  <summary>${iconOnly ? iconClass : `${iconClass} ${item.label}`}</summary>
                  ${item.subItems ? html`
                    <ul>
                      ${item.subItems.map(subItem => html`<li><a class="${activeClass}">${subItem.label}</a></li>`)}
                    </ul>
                  ` : ""}
                </details>
              `;
    } else {
      return html`
                <li><a class="${activeClass}">${iconOnly ? iconClass : `${iconClass} ${item.label}`}</a></li>
              `;
    }
  })}
        </ul>
      `;
    },
  },
  "uix-link": {
    props: {
      href: { type: String, defaultValue: "#" },
      content: { type: String, defaultValue: "Link" },
      external: { type: Boolean, defaultValue: false },
      variant: { 
        type: String, 
        defaultValue: "primary",
        enum: Variants
      },
      underlineOnHover: { type: Boolean, defaultValue: false },
      icon: { type: String, defaultValue: null }
    },
    render: ({ href, content, external, variant, underlineOnHover, icon }, { html }) => {
      const textColorClass = TextColor[variant];
      
      const hoverUnderlineClass = underlineOnHover ? "hover:underline" : "underline";
      return html`
          <a href=${href} 
             class="${textColorClass} ${hoverUnderlineClass}" 
             ${external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}
          >
            ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
            ${content}
          </a>
        `;
    },
  },
  "uix-hero": {
    props: {
      title: { type: String, defaultValue: "Hello there" },
      description: { type: String, defaultValue: "" },
      variant: { type: String, defaultValue: "base", enum: Variants },
      imageUrl: { type: String, defaultValue: null },
      overlayOpacity: { type: Number, defaultValue: 60 }
    },
    render: ({ title, description, variant, imageUrl, overlayOpacity }, { html }) => {
      const bgColorClass = BgColor[variant];
      const textColorClass = TextColor[variant];
      return html`
        <div class="hero min-h-[30rem] rounded ${imageUrl ? `style="background-image: url(${imageUrl});"` : bgColorClass}">
          ${imageUrl ? html`<div class="hero-overlay rounded ${BgOverlayOpacity[overlayOpacity]}"></div>` : ""}
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
  "uix-radio": {
    props: {
      selectedValue: { type: String, defaultValue: "" },
      options: { type: Array, defaultValue: [] },
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
      disabled: { type: Boolean, defaultValue: false },
      withCustomColors: { type: Boolean, defaultValue: false }
    },
    render: ({ selectedValue, options, disabled, variant, size, withCustomColors }, { html }) => {
      const RadioVariantClass = {
        "primary": "radio-primary",
        "secondary": "radio-secondary",
        "accent": "radio-accent",
        "neutral": "radio-neutral",
        "base": "radio-base",
        "info": "radio-info",
        "success": "radio-success",
        "warning": "radio-warning",
        "error": "radio-error"
      };

      const RadioSizeClass = {
        "md": "radio-md",
        "sm": "radio-sm",
        "lg": "radio-lg",
        "xs": "radio-xs"
      };
      const radioClass = `radio ${RadioVariantClass[variant] || ""} ${RadioSizeClass[size]}`;
   
      return html`
        <div class="flex flex-col">
          ${options.map(option => html`
            <div class="form-control">
              <label class="cursor-pointer label">
                <span class="label-text">${option.label}</span> 
                <input type="radio" name="uix-radio-group" class="${radioClass} ${withCustomColors && option.color ? `checked:bg-${option.color}-500` : ""}" value=${option.value} .checked="${selectedValue === option.value}" ?disabled=${disabled}>
              </label>
            </div>
          `)}
        </div>
      `;
    },
  },
  "uix-tooltip": {
    props: {
      content: { type: String, defaultValue: "Tooltip Content" },
      position: { type: String, defaultValue: "top", enum: Positions },
      trigger: { type: String, defaultValue: "hover", enum: Triggers },
      isOpen: { type: Boolean, defaultValue: false },
      variant: { type: String, defaultValue: "primary", enum: Variants },
    },
    render: ({ content, position, trigger, isOpen, setIsOpen, color }, { html }) => {
      const tooltipPositionClass = `tooltip-${position}`;
      const tooltipColorClass = `tooltip-${color}`;
      
      const tooltipClasses = [
        "tooltip",
        tooltipPositionClass,
        isOpen ? "tooltip-open" : "",
        tooltipColorClass
      ].join(" ");
      
      return html`
        <div class=${tooltipClasses} data-tip=${content}>
          <uix-button
            @on${trigger}=${() => setIsOpen(true)}
            @onmouseleave=${() => setIsOpen(false)}>
            ${content}
          </uix-button>
        </div>
      `;
    },
  },
  "uix-toggle": {
    props: {
      on: { type: Boolean, defaultValue: false },
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
      label: { type: String, defaultValue: "Toggle" },
      disabled: { type: Boolean, defaultValue: false },
      change: { type: Function }
    },
    render: ({ on, indeterminate, change, label, disabled, variant, size }, { html }) => {
      const ToggleVariantClass = {
        "primary": "toggle-primary",
        "secondary": "toggle-secondary",
        "accent": "toggle-accent",
        "neutral": "toggle-neutral",
        "base": "toggle-base",
        "info": "toggle-info",
        "success": "toggle-success",
        "warning": "toggle-warning",
        "error": "toggle-error"
      };
      
      const ToggleSizeClass = {
        "md": "toggle-md",
        "sm": "toggle-sm",
        "lg": "toggle-lg",
        "xs": "toggle-xs"
      };


      // Handle the indeterminate state.
      const postRender = (el) => {
        const inputEl = el.querySelector("input[type=\"checkbox\"]");
        if (inputEl) inputEl.indeterminate = indeterminate;
      };
  
      const variantClass = ToggleVariantClass[variant] || "";
      const sizeClass = ToggleSizeClass[size];
  
      return html`
        <div class="form-control w-52">
          <label class="cursor-pointer label">
            <span class="label-text">${label}</span>
            <input 
              type="checkbox" 
              @change=${change} 
              ?checked=${on} 
              ?disabled=${disabled} 
              class="toggle ${variantClass} ${sizeClass}"
              @postRender=${postRender}
            >
          </label>
        </div>
      `;
    },
  },
  "uix-toast": {
    props: {
      content: { type: Array, defaultValue: [{message: "Default Message", type: "info"}] }, // Assuming a list of alerts
      duration: { type: Number, defaultValue: 3000 },
      horizontalPosition: { type: String, defaultValue: "end", enum: Positions },
      verticalPosition: { type: String, defaultValue: "bottom", enum: Positions },
    },
    render: ({ content, duration, horizontalPosition, verticalPosition }, { html }) => {
      const ToastPositionHorizontalClass = {
        "start": "toast-start",
        "center": "toast-center",
        "end": "toast-end",
        "left": "toast-left",
        "right": "toast-right",
        "top-right": "toast-top-right",
        "top-left": "toast-top-left",
        "bottom-right": "toast-bottom-right",
        "bottom-left": "toast-bottom-left"
      };

      const ToastPositionVerticalClass = {
        "top": "toast-top",
        "middle": "toast-middle",
        "bottom": "toast-bottom",
        "top-end": "toast-top-end",
        "bottom-middle": "toast-bottom-middle"
      };
      const AlertTypes = {
        "info": "alert-info",
        "success": "alert-success",
        "warning": "alert-warning",
        "error": "alert-error"
      };
      
      const horizontalClass = ToastPositionHorizontalClass[horizontalPosition] || "";
      const verticalClass = ToastPositionVerticalClass[verticalPosition] || "";
   
      return html`
      <div class="toast ${horizontalClass} ${verticalClass}" style="animation-duration: ${duration}ms;">
        ${content.map(alert => html`
          <div class="alert ${AlertTypes[item.type || "info"]}">
            ${alert.icon ? html`<uix-icon name=${alert.icon}></uix-icon>` : ""}
            <span>${alert.message}</span>
          </div>
        `)}
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
      keyup: { type: Function },
      style: { type: String, defaultValue: "bordered", enum: Styles },
      variant: { type: String, defaultValue: "default", enum: Variants },
      size: { type: String, defaultValue: "md", enum: Sizes },
      hasFormControl: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: null },
      labelAlt: { type: Array, defaultValue: [] }, // For top-right, bottom-left, bottom-right labels
    },
    render: ({ value, keyup, placeholder, disabled, type, maxLength, style, variant, size, hasFormControl, label, labelAlt }, { html }) => {      
      const InputVariantClass = {
        "primary": "input-primary",
        "secondary": "input-secondary",
        "accent": "input-accent",
        "neutral": "input-neutral",
        "base": "input-base",
        "info": "input-info",
        "success": "input-success",
        "warning": "input-warning",
        "error": "input-error"
      };

      const InputStyleClass = {
        "ghost": "input-ghost",
        "link": "input-link",
        "outline": "input-outline",
        "glass": "input-glass",
        "active": "input-active",
        "disabled": "input-disabled",
        "bordered": "input-bordered"
      };
      
      const InputSizeClass = {
        "lg": "input-lg",
        "md": "input-md",
        "sm": "input-sm",
        "xs": "input-xs"
      };

      const inputClass = `${InputStyleClass[style] || ""} ${InputVariantClass[variant] || ""} ${InputSizeClass[size]}`;
   
      const inputElem = html`
        <input 
          class="${inputClass}" 
          @keyup=${keyup}
          .value=${value || ""}
          placeholder=${placeholder} 
          ?disabled=${disabled} 
          type=${type} 
          ${maxLength !== null ? `maxlength=${maxLength}` : ""}>
      `;
  
      if (hasFormControl) {
        return html`
          <div class="form-control">
            ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
            ${inputElem}
            ${labelAlt && labelAlt.length ? html`<label class="label">
              ${labelAlt[0] ? html`<span class="label-text-alt">${labelAlt[0]}</span>` : ""}
              ${labelAlt[1] ? html`<span class="label-text-alt">${labelAlt[1]}</span>` : ""}
            </label>` : ""}
          </div>
        `;
      }
  
      return inputElem;
    },
  },
  "uix-textarea": {
    props: {
      value: { type: String, defaultValue: "" },
      placeholder: { type: String, defaultValue: "Enter text" },
      disabled: { type: Boolean, defaultValue: false },
      rows: { type: Number, defaultValue: 4 },
      variant: { type: String, defaultValue: "bordered", enum: Styles },
      color: { type: String, defaultValue: "default", enum: Variants },
      size: { type: String, defaultValue: "md", enum: Sizes },
      hasFormControl: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: null },
      labelAlt: { type: Array, defaultValue: [] } // For alt labels
    },
    render: ({ value, placeholder, disabled, rows, variant, color, size, hasFormControl, label, labelAlt }, { html }) => {
      
      const textareaClass = `textarea ${variant === "bordered" ? "textarea-bordered" : ""} textarea-${color} textarea-${size}`;
  
      const textareaElem = html`
        <textarea 
          class="${textareaClass}" 
          placeholder=${placeholder} 
          ?disabled=${disabled} 
          rows=${rows}>${value}</textarea>
      `;
  
      if (hasFormControl) {
        return html`
          <div class="form-control">
            ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
            ${textareaElem}
            ${labelAlt && labelAlt.length ? html`
              <label class="label">
                ${labelAlt.map(alt => html`<span class="label-text-alt">${alt}</span>`)}
              </label>` : ""}
          </div>
        `;
      } else {
        return textareaElem;
      }
    },
  },  
  "uix-file-input": {
    props: {
      acceptedTypes: { type: String, defaultValue: "*/*" },
      multiple: { type: Boolean, defaultValue: false },
      label: { type: String, defaultValue: null },
      altLabel: { type: String, defaultValue: null },
      variant: {
        type: String,
        defaultValue: "neutral",
        enum: Variants
      },
      bordered: { type: Boolean, defaultValue: false },
      ghost: { type: Boolean, defaultValue: false },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      },
      disabled: { type: Boolean, defaultValue: false }
    },
    render: ({ acceptedTypes, multiple, label, altLabel, variant, bordered, ghost, size, disabled }, { html }) => {
      
      const FileInputColor = {
        "primary": "file-input-primary",
        "secondary": "file-input-secondary",
        "accent": "file-input-accent",
        "neutral": "file-input-neutral",
        "base": "file-input-base",
        "info": "file-input-info",
        "success": "file-input-success",
        "warning": "file-input-warning",
        "error": "file-input-error"
      };
      const FileInputSize = {
        "lg": "file-input-lg",
        "md": "file-input-md",
        "sm": "file-input-sm",
        "xs": "file-input-xs"
      };
      // Base classes
      let inputClasses = "file-input w-full max-w-xs";
      
      // Add variant color
      if (variant && Variants.includes(variant)) {
        inputClasses += FileInputColor[variant];
      }
      
      // Add bordered style
      if (bordered) {
        inputClasses += " file-input-bordered";
      }
      
      // Add ghost style
      if (ghost) {
        inputClasses += " file-input-ghost";
      }
  
      // Add size
      if (size && Sizes.includes(size)) {
        inputClasses += FileInputSize(size);
      }
  
      // Render
      return html`
        <div class="form-control w-full max-w-xs">
          ${label ? html`<label class="label">
            <span class="label-text">${label}</span>
            ${altLabel ? html`<span class="label-text-alt">${altLabel}</span>` : ""}
          </label>` : ""}
          
          <input type="file" accept=${acceptedTypes} ?multiple=${multiple} class=${inputClasses} ?disabled=${disabled} />
          
          ${altLabel ? html`<label class="label">
            <span class="label-text-alt">${altLabel}</span>
          </label>` : ""}
        </div>
      `;
    },
  },
  "uix-range-slider": {
    props: {
      min: { type: Number, defaultValue: 0 },
      max: { type: Number, defaultValue: 100 },
      step: { type: Number, defaultValue: 1 },
      value: { type: Number, defaultValue: 50 },
      variant: {
        type: String,
        defaultValue: "neutral",
        enum: Variants
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      }
    },
    render: ({ min, max, step, value, variant, size }, { html }) => {
      const RangeColor = {
        "primary": "range-primary",
        "secondary": "range-secondary",
        "accent": "range-accent",
        "neutral": "range-neutral",
        "base": "range-base",
        "info": "range-info",
        "success": "range-success",
        "warning": "range-warning",
        "error": "range-error"
      };

      const RangeSize = {
        "lg": "range-lg",
        "md": "range-md",
        "sm": "range-sm",
        "xs": "range-xs"
      };

      const colorClass = RangeColor[variant];
      const sizeClass = RangeSize[size];
  
      return html`
        <input type="range" 
               min=${min} 
               max=${max} 
               step=${step} 
               value=${value} 
               class="range ${colorClass} ${sizeClass} max-w-xs"
        />
      `;
    },
  },
  "uix-select": {
    props: {
      options: { type: Array, defaultValue: [] },
      variant: { 
        type: String, 
        defaultValue: "base",
        enum: Variants 
      },
      label: { type: String, defaultValue: "" },
      altLabel: { type: String, defaultValue: "" },
      size: { 
        type: String, 
        defaultValue: "md",
        enum: Sizes
      }
    },
    render: ({ options, variant, label, altLabel, size }, { html }) => {
      const SelectColors = {
        "primary": "select-primary",
        "secondary": "select-secondary",
        "accent": "select-accent",
        "neutral": "select-neutral",
        "base": "select-base",
        "info": "select-info",
        "success": "select-success",
        "warning": "select-warning",
        "error": "select-error"
      };
      const SelectSizes = {
        "lg": "select-lg",
        "md": "select-md",
        "sm": "select-sm",
        "xs": "select-xs"
      };      
      const variantClass =  SelectColors[variant];
      const sizeClass = SelectSizes[size];
      
      return html`
        <div class="form-control w-full max-w-xs">
          ${label ? html`<label class="label"><span class="label-text">${label}</span></label>` : ""}
          <select class="select ${variantClass} ${sizeClass} w-full max-w-xs">
            ${options.map(option => html`
              <option>${option}</option>
            `)}
          </select>
          ${altLabel ? html`<label class="label"><span class="label-text-alt">${altLabel}</span></label>` : ""}
        </div>
      `;
    }
  },  
  "uix-rating": {
    // TODO: expand daisyUI tags as the JIT can't get dynamic ones
    props: {
      maxValue: { type: Number, defaultValue: 5 },
      value: { type: Number, defaultValue: 0 },
      mask: { type: String, defaultValue: "star", enum: ["star", "heart"] },
      color: { type: String, defaultValue: "neutral", enum: ["orange", "red", "yellow", "lime", "green"] },
      size: { type: String, defaultValue: "md", enum: Sizes },
      allowReset: { type: Boolean, defaultValue: false },
      half: { type: Boolean, defaultValue: false }
    },
    render: ({ maxValue, value, mask, color, size, allowReset, half }, { html }) => {
      const RatingSizeClasses = {
        "lg": "rating-lg",
        "md": "rating-md",
        "sm": "rating-sm",
        "xs": "rating-xs"
      };    
      const maskClass =  mask === "star" ? half ? "mask-star-2" : 
        "mask-star" : half ? "mask-heart-2" : 
        "mask-heart";
      const colorClass = BgColor[color];
      const sizeClass = RatingSizeClasses[size];
      
      return html`
        <div class="rating ${sizeClass}">
          ${allowReset ? html`<input type="radio" name="rating" class="rating-hidden" />` : ""}
          
          ${Array.from({ length: maxValue * (half ? 2 : 1) }).map((_, index) => 
    html`
              <input type="radio" 
                     name="rating" 
                     class="mask ${maskClass} ${index < value * (half ? 2 : 1) ? colorClass : ""} ${half && index % 2 == 0 ? "mask-half-1" : ""} ${half && index % 2 != 0 ? "mask-half-2" : ""}" 
                     ${index < value * (half ? 2 : 1) ? "checked" : ""}
              />
            `
  )}
        </div>
      `;
    },
  },
  "uix-artboard": {
    // TODO: expand daisyUI tags as the JIT can't get dynamic ones
    props: {
      content: { type: String, defaultValue: "Artboard Content" },
      demo: { type: Boolean, defaultValue: false }, // artboard-demo for shadow, radius, and centering
      size: { type: Number, defaultValue: 1, enum: [1,2,3,4,5,6] },
      horizontal: { type: Boolean, defaultValue: false }
    },
    render: ({ content, size, horizontal, demo }, { html }) => {
      const PhoneSize = {
        1: "phone-1",
        2: "phone-2",
        3: "phone-3",
        4: "phone-4",
        5: "phone-5",
        6: "phone-6",
      };
      const sizeClass = PhoneSize[size];
      const orientationClass = horizontal ? "artboard-horizontal" : "";
      const demoClass = demo ? "artboard-demo" : "";
      return html`
        <div class="artboard ${sizeClass} ${orientationClass} ${demoClass}">
          ${content}
        </div>
      `;
    },
  },
  "uix-stack": {
    props: {
      direction: { 
        type: String, 
        defaultValue: "vertical", 
        enum: Directions 
      },
      spacing: { 
        type: String, 
        defaultValue: "md",
        enum: Spacings
      }
    },
    render: ({ direction, spacing }, { html }) => {
      const SpacingXClasses = {
        "lg": "space-x-lg",
        "md": "space-x-md",
        "sm": "space-x-sm",
        "xs": "space-x-xs"
      };
      const SpacingYClasses = {
        "lg": "space-y-lg",
        "md": "space-y-md",
        "sm": "space-y-sm",
        "xs": "space-y-xs"
      };
      const spacingClass = spacing === "none" ? "" : (direction === "horizontal" ? SpacingXClasses[spacing] :  SpacingYClasses[spacing]);
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      return html`
        <div class="stack flex ${directionClass} ${spacingClass}">
          <slot></slot>
        </div>
      `;
    },
  },
  "uix-join": {
    props: {
      direction: {
        type: String,
        defaultValue: "horizontal",
        enum: Directions
      },
      layout: {
        type: String,
        defaultValue: "default",
        enum: Layouts
      },
      customBorder: { type: Boolean, defaultValue: false }
    },
    render: ({ direction, layout, customBorder }, { html }) => {
  
      // Apply responsive behavior if needed
      const responsiveClass = layout === "responsive" ? "sm:flex-col lg:flex-row" : "";
  
      // Apply custom border radii if specified
      const borderRadiusClass = customBorder ? "rounded-l-full rounded-r-full" : "";
  
      return html`
        <div class="join join-${direction} ${responsiveClass} ${borderRadiusClass}">
          <slot></slot>
        </div>
      `;
    },
  },
  "uix-list": {
    props: {
      direction: {
        type: String,
        defaultValue: "horizontal",
        enum: Directions
      },
      layout: {
        type: String,
        defaultValue: "default",
        enum: Layouts
      },
      customBorder: { type: Boolean, defaultValue: false }
    },
    render: ({ direction, layout, customBorder }, { html }) => {
      // Choose appropriate flex direction
      const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
      // Apply responsive behavior if needed
      const responsiveClass = layout === "responsive" ? "sm:flex-col lg:flex-row" : "";
  
      // Apply custom border radii if specified
      const borderRadiusClass = customBorder ? "rounded-l-full rounded-r-full" : "";
  
      return html`
        <div class="flex ${directionClass} ${responsiveClass} ${borderRadiusClass}">
          <slot></slot>
        </div>
      `;
    },
  },
  "uix-navbar": {
    props: {
      variant: { 
        type: String,
        defaultValue: "base-100",
        enum: Variants
      },
      shadow: { type: Boolean, defaultValue: true },
      rounded: { type: Boolean, defaultValue: true },
      part: {
        type: String,
        defaultValue: "center",
        enum: NavbarPart
      },
      icon: { type: Boolean, defaultValue: false },
      menu: { type: Array, defaultValue: [] },
      title: { type: String, defaultValue: "daisyUI" }
    },
    render: ({ variant, shadow, rounded, part, icon, menu, title }, { html }) => {
      const NavbarPartClasses = {
        "start": "navbar-start", 
        "center": "navbar-center",
        "end": "navbar-end"
      };

      const baseClasses = `navbar ${BgColor[variant]}`;
      const shadowClass = shadow ? "shadow-xl" : "";
      const roundedClass = rounded ? "rounded-box" : "";
      const partClass = NavbarPartClasses[part];
      
      return html`
        <div class="${baseClasses} ${shadowClass} ${roundedClass}">
          <div class="${partClass}">
            ${icon ? html`<uix-icon></uix-icon>` : ""}
            <a class="btn btn-ghost normal-case text-xl">${title}</a>
          </div>
          ${menu.length > 0 ? html`
            <div class="flex-none gap-2">
              <ul class="menu menu-horizontal px-1 bg-${variant}">
                ${menu.map(item => {
    if (item.submenu) {
      return html`
                      <li>
                        <details>
                          <summary>${item.label}</summary>
                          <ul class="p-2 bg-${variant}">
                            ${item.submenu.map(subItem => html`
                              <li><a>${subItem.label}</a></li>
                            `)}
                          </ul>
                        </details>
                      </li>
                    `;
    }
    return html`<li><a>${item.label}</a></li>`;
  })}
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
  "uix-tabs": {
    props: {
      items: { 
        type: Array,
        defaultValue: []
      },
      selectedValue: { 
        type: String, 
        defaultValue: "" 
      },
      styleVariant: {
        type: String,
        defaultValue: "default", // can be "boxed", "bordered", "lifted"
        enum: ["default", "boxed", "bordered", "lifted"]
      },
      size: {
        type: String,
        defaultValue: "md",
        enum: Sizes
      }
    },
    render: ({ items, selectedValue, styleVariant, size }, { html }) => {
      const getTabClass = (item) => {
        let baseClass = "tab";
        if (item.value === selectedValue) baseClass += " tab-active";
        if (item.disabled) baseClass += " tab-disabled";
        if (styleVariant === "bordered") baseClass += " tab-bordered";
        if (styleVariant === "lifted") baseClass += " tab-lifted";
        if (Sizes.includes(size)) baseClass += ` tab-${size}`;
        return baseClass;
      };
  
      return html`
        <div class=${`tabs ${styleVariant === "boxed" ? "tabs-boxed" : ""}`}>
          ${items.map(item => html`
            <a class=${getTabClass(item)} href=${item.href || "#"} role="tab">
              ${item.icon ? html`<uix-icon name=${item.icon}></uix-icon>` : ""}
              ${item.label}
            </a>
          `)}
        </div>
      `;
    },
  },  
  "uix-progress": {
    // TODO: expand daisyui tags
    props: {
      value: { type: Number, defaultValue: 0 },
      max: { type: Number, defaultValue: 100 },
      width: { type: String, defaultValue: "w-56" },
      variant: {
        type: String,
        defaultValue: "base",
        enum: Variants
      }
    },
    render: ({ value, max, width, variant }, { html }) => {
      const progressClass = `progress ${width}`;
      const variantClass = variant !== "base" ? `progress-${variant}` : "";
      return html`
        <progress class="${progressClass} ${variantClass}" value="${value}" max="${max}"></progress>
      `;
    },
  },

  "uix-radial-progress": {
    // TODO: expand daisyui tags
    props: {
      value: { 
        type: Number,
        defaultValue: 0 
      },
      size: { 
        type: String,
        defaultValue: "4rem" 
      },
      thickness: { 
        type: String,
        defaultValue: "0.4rem" // 10% of the default size 
      },
      variant: { 
        type: String,
        defaultValue: "primary",
        enum: Variants
      },
      backgroundColor: { 
        type: String,
        defaultValue: "default" // Change this as per need.
      },
      borderColor: { 
        type: String,
        defaultValue: "default" // Change this as per need.
      },
      borderWidth: {
        type: String,
        defaultValue: "0px"
      },
      textColor: {
        type: String,
        defaultValue: "default-content" // Change this as per need.
      }
    },
    render: ({ value, size, thickness, variant, backgroundColor, borderColor, borderWidth, textColor }, { html }) => {
      const textStyle = `text-${textColor}`;
      const bgColor = backgroundColor !== "default" ? BgColor[backgroundColor] : "";
      const borderColorStyle = borderColor !== "default" ? `border-${borderWidth} ${BorderColor[borderColor]}` : "";
      const textSizeStyle = `text-${variant}`;
      return html`
        <div 
          class="radial-progress ${textSizeStyle} ${bgColor} ${borderColorStyle} ${textStyle}"
          style="--value:${value}; --size:${size}; --thickness:${thickness};"
        >
          ${value}%
        </div>
      `;
    },
  },
  "uix-table": {
    props: {
      rows: { type: Array, defaultValue: [] },
      headers: { type: Array, defaultValue: [] },
      zebra: { type: Boolean, defaultValue: false },
      pinRows: { type: Boolean, defaultValue: false },
      pinCols: { type: Boolean, defaultValue: false },
      size: { 
        type: String,
        defaultValue: "md",
        enum: Sizes
      }
    },
    render: ({ rows, headers, zebra, pinRows, pinCols, size }, { html }) => {
      const tableClass = `table 
      ${zebra ? "table-zebra" : ""} 
      ${pinRows ? "table-pin-rows" : ""} 
      ${pinCols ? "table-pin-cols" : ""} 
      table-${size}`;
      return html`
          <div class="overflow-x-auto">
            <table class=${tableClass}>
              <thead>
                ${headers.map(header => html`<th>${header}</th>`)}
              </thead>
              <tbody>
                ${rows.map(row => html`
                  <tr>
                    ${row.map(cell => html`<td>${cell}</td>`)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `;
    },
  },
  "uix-steps": {
    // TODO: expand daisyui tags
    props: {
      steps: {
        type: Array,
        defaultValue: [],
        enum: Variants,
      }, // Array of objects with properties: label, icon, variant.
      direction: { type: String, defaultValue: "horizontal", enum: ["horizontal", "vertical", "responsive"] },
      scrollable: { type: Boolean, defaultValue: false }
    },
    render: ({ steps, direction, scrollable }, { html }) => {
      const directionClass = direction === "responsive" ? "steps-vertical lg:steps-horizontal" : `steps-${direction}`;
      const wrapperClass = scrollable ? "overflow-x-auto" : "";
  
      return html`
        <div class="${wrapperClass}">
          <ul class="steps ${directionClass}">
            ${steps.map(step => {
    const stepClass = `step step-${step.variant}`;
    return step.icon ? 
      html`<li class="${stepClass}"><uix-icon name="${step.icon}"></uix-icon> ${step.label}</li>` :
      html`<li class="${stepClass}">${step.label}</li>`;
  })}
          </ul>
        </div>
      `;
    },
  },
  "uix-swap": {
    props: {
      isActive: { type: Boolean, defaultValue: false },  // To represent the swap-active state
      isRotated: { type: Boolean, defaultValue: false }, // To represent the swap-rotate effect
      isFlipped: { type: Boolean, defaultValue: false }, // To represent the swap-flip effect
      variant: { 
        type: String,
        defaultValue: "base",
        enum: Variants
      }
    },
    render: ({ isActive, isRotated, isFlipped, variant }, { html }) => {
      const baseClass = "swap";
      const activeClass = isActive ? "swap-active" : "";
      const rotateClass = isRotated ? "swap-rotate" : "";
      const flipClass = isFlipped ? "swap-flip" : "";
      const bgColorClass = BgColor[variant];
      

      return html`
        <label class="${baseClass} ${activeClass} ${rotateClass} ${flipClass}">
          <input type="checkbox" />
          <div class="swap-on ${bgColorClass}">ON Content</div>
          <div class="swap-off ${bgColorClass}">OFF Content</div>
        </label>
      `;
    }
  },
  
  "uix-indicator": {
    // TODO: expand daisyui tags
    props: {
      content: { type: String, defaultValue: "" },
      badge: { type: String, defaultValue: "" }, // This can be text, number or any label
      horizontalPosition: {
        type: String,
        defaultValue: "end",
        enum: Positions.filter(p => ["start", "center", "end"].includes(p))
      },
      verticalPosition: {
        type: String,
        defaultValue: "top",
        enum: Positions.filter(p => ["top", "middle", "bottom"].includes(p))
      },
      responsivePositions: {
        type: Object,
        defaultValue: {}
      },
      badgeColor: {
        type: String,
        defaultValue: "secondary",
        enum: Variants
      }
    },
    render: ({ content, badge, horizontalPosition, verticalPosition, responsivePositions, badgeColor }, { html }) => {
      const colorClass = `badge-${badgeColor}`;
      let positionClasses = `indicator-item indicator-${horizontalPosition} indicator-${verticalPosition}`;
      
      Resolutions.forEach(res => {
        if(responsivePositions[res]) {
          const { horizontal, vertical } = responsivePositions[res];
          positionClasses += ` ${res}:indicator-${horizontal} ${res}:indicator-${vertical}`;
        }
      });
  
      return html`
        <div class="indicator">
          <span class="${positionClasses} ${colorClass}">${badge}</span>
          <div>${content}</div>
        </div>
      `;
    },
  },
  "uix-stat-container": {
    props: {
      orientation: { type: String, defaultValue: "horizontal", enum: ["horizontal", "vertical"] },
      shadow: { type: Boolean, defaultValue: true }
    },
    render: ({ orientation, shadow, children }, { html }) => {
      const orientationClass = orientation === "vertical" ? "stats-vertical" : "";
      const shadowClass = shadow ? "shadow" : "";
      return html`
        <div class="stats ${orientationClass} ${shadowClass}">
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
  }
};
      