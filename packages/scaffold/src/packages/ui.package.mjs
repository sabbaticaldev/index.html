import {
  AlignX,
  AlignY,
  ButtonColors,
  ButtonSizes,
  ButtonShapes,
  ButtonVariants,
  Positions,
  TabsSize,
  Resolutions,
  Gaps,
  MenuSize,
  Spacings,
  AnimationTypes,
  ModalPositions,
  Methods,
  Sizes,
  Shapes,
  Variants,
  Triggers,
  Formats,
  Colors,
  BgColor,
  TextColor,
  BorderColor,
  CollapseBgColor,
  CollapseIcon,
  RingColor
} from "../style-props.mjs";

export default {
  views: {
    "uix-accordion": {
      props: {
        items: { type: Array, defaultValue: [] },
        color: { type: String, defaultValue: "base", enum: Colors },
        method: {
          type: String,
          defaultValue: "focus",
          enum: ["focus", "checkbox", "details"]
        }, // Propagate the method of collapsing.
        icon: { type: String, defaultValue: "", enum: ["", "arrow", "plus"] } // Propagate the icon type.
      },
      render: ({ items, color, method, icon }, { html }) => {
        return html`
          ${items.map(
    (item) => html`
              <uix-collapse
                title=${item.title}
                content=${item.content}
                color=${color}
                method=${method}
                icon=${icon}
              ></uix-collapse>
            `
  )}
        `;
      }
    },
    "uix-alert": {
      props: {
        title: { type: String, defaultValue: "" },
        message: { type: String, defaultValue: "" },
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        },
        closable: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false },
        border: { type: Boolean, defaultValue: false },
        actions: { type: Array, defaultValue: [] }
      },
      render: (
        { title, message, rounded, color, closable, actions, border },
        { html }
      ) => {
        const colorClass = [
          BgColor[color],
          border ? BorderColor[color] : "",
          TextColor[color]
        ]
          .filter((cls) => !!cls)
          .join(" ");

        return html`
          <div class="alert ${(rounded && "rounded") || ""} ${colorClass}">
            <div class="flex justify-between items-center">
              <div>
                ${title
    ? html`<h3 class="font-semibold mb-2">${title}</h3>`
    : ""}
                <div class="text-xs">${message}</div>
              </div>
              <div>
                ${closable
    ? html`<uix-button color="neutral">&times;</uix-button>`
    : ""}
              </div>
            </div>
            ${actions.length > 0
    ? html`
                  <div class="mt-4">
                    ${actions.map(
    (action) =>
      html`<uix-button .action=${action.action}
                          >${action.label}</uix-button
                        >`
  )}
                  </div>
                `
    : ""}
          </div>
        `;
      }
    },
    "uix-avatar": {
      props: {
        src: { type: String },
        alt: { type: String, defaultValue: "" },
        size: { type: Number, defaultValue: 24 },
        shape: {
          type: String,
          defaultValue: "rounded",
          enum: [
            "rounded",
            "rounded-full",
            "mask-squircle",
            "mask-hexagon",
            "mask-triangle"
          ]
        },
        status: { type: String, enum: ["online", "offline", ""] },
        placeholder: { type: String, defaultValue: "" },
        hasRing: { type: Boolean, defaultValue: false },
        ringColor: { type: String, defaultValue: "primary", enum: Colors }
      },
      render: (
        { src, alt, size, shape, status, placeholder, hasRing, ringColor },
        { html }
      ) => {
        const sizeClass = `w-${size}`;
        const ringClass = hasRing
          ? `${RingColor[ringColor]} ring-offset-base-100 ring-offset-2`
          : "";
        let content;

        if (src) {
          content = html`<img src=${src} alt=${alt} />`;
        } else if (placeholder) {
          content = html`<span
            class="${size > 12 ? `text-${Math.round(size / 8)}xl` : "text-xs"}"
            >${placeholder}</span
          >`;
        }

        return html`
          <div class="avatar ${status} ${ringClass}">
            <div class="${sizeClass} ${shape}">${content}</div>
          </div>
        `;
      }
    },
    "uix-avatar-group": {
      props: {
        avatars: { type: Array, defaultValue: [] },
        count: { type: Number, defaultValue: 0 }
      },
      render: ({ avatars, count }, { html }) => {
        return html`
          <div class="avatar-group -space-x-6">
            ${avatars.map(
    (avatar) => html`
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
              `
  )}
            ${count > 0
    ? html`
                  <div class="avatar placeholder">
                    <div class="w-12 bg-neutral-focus text-neutral-content">
                      <span>+${count}</span>
                    </div>
                  </div>
                `
    : ""}
          </div>
        `;
      }
    },
    "uix-badge": {
      props: {
        content: { type: String, defaultValue: "" },
        color: {
          type: String,
          defaultValue: "default",
          enum: Colors
        },
        outline: { type: Boolean, defaultValue: false },
        size: {
          type: String,
          defaultValue: "md",
          enum: ["lg", "md", "sm", "xs"]
        },
        icon: { type: String, defaultValue: null }
      },
      render: ({ color, outline, size }, { html }) => {
        const baseClass = "badge";
        const colorClass = BgColor[color] + (outline ? "-outline" : "");
        const sizeClassMapping = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs"
        };
        const sizeClass = sizeClassMapping[size];

        return html`
          <span class="${baseClass} ${colorClass} ${sizeClass}">
            <slot></slot>
          </span>
        `;
      }
    },
    "uix-icon": {
      props: {
        name: "",
        classes: {}
      },
      render: (
        { name, classes: { container: containerClass = "text-2xl" } },
        { html }
      ) => {
        return html`<ion-icon
          name=${name}
          class=${containerClass}
          role="img"
        ></ion-icon>`;
      }
    },
    "uix-alerts-container": {
      // TODO: create a container for alerts that knows how to close alert
      props: {},
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
      render: ({ content, color, outline, size, icon }, { html }) => {
        const BadgeSizes = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs"
        };
        const baseClass = "badge";
        const colorClass = BgColor[color] + (outline ? "-outline" : "");
        const sizeClass = BadgeSizes[size];
        const iconRender = icon
          ? html`<uix-icon name=${icon} class="w-4 h-4 mr-2"></uix-icon>`
          : "";

        return html`
          <span class="${baseClass} ${colorClass} ${sizeClass}">
            ${iconRender} ${content}
          </span>
        `;
      }
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
          md: "btm-nav-md",
          sm: "btm-nav-sm",
          lg: "btm-nav-lg",
          xl: "btm-nav-xl"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    ${item.icon}
                  </svg>
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
          enum: Colors
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        href: {
          type: String,
          defaultValue: ""
        },
        label: {
          type: String,
          defaultValue: ""
        },
        type: {
          type: String,
          defaultValue: "button"
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
          enum: Variants
        },
        click: { type: Function, defaultValue: "" },
        isLoading: { type: Boolean, defaultValue: false },
        icon: { type: String, defaultValue: "" },
        endIcon: { type: String, defaultValue: "" },
        border: { type: Boolean, defaultValue: false },
        noAnimation: { type: Boolean, defaultValue: false }
      },
      render: (host, { html }) => {
        const {
          variant,
          type,
          size,
          label,
          click,
          fullWidth,
          border,
          href,
          shape,
          color,
          isLoading,
          icon,
          endIcon,
          noAnimation
        } = host;
        const btnClass = [
          "flex flex-row items-center gap-2",
          href && !variant ? "" : "btn",
          ButtonColors[color] || "",
          (border && BorderColor[color]) || "",
          ButtonSizes[size] || "",
          fullWidth ? "btn-block" : "",
          ButtonShapes[shape] || "",
          ButtonVariants[variant] || "",
          noAnimation ? "no-animation" : ""
        ]
          .filter((c) => !!c)
          .join(" ");
        const innerContent = [
          icon ? html`<uix-icon name=${icon}></uix-icon>` : "",
          label ? label : html`<slot></slot>`,
          endIcon ? html`<uix-icon name=${endIcon}></uix-icon>` : "",
          isLoading && html`<span class="loading loading-spinner"></span>`
        ];

        return href
          ? html`
              <a
                class=${btnClass}
                href=${href}
                @click=${(event) => click?.({ event, host })}
              >
                ${innerContent}
              </a>
            `
          : html`
              <button
                type=${type || "button"}
                class=${btnClass}
                @click=${(event) => click?.({ event, host })}
              >
                ${innerContent}
              </button>
            `;
      }
    },
    "uix-card": {
      props: {
        title: { type: String, defaultValue: "" },
        subtitle: { type: String, defaultValue: "" },
        content: { type: String, defaultValue: "" },
        image: { type: String, defaultValue: "" },
        footerContent: { type: String, defaultValue: "" },
        color: { type: String, defaultValue: "base-100", enum: Colors },
        compact: { type: Boolean, defaultValue: false },
        bordered: { type: Boolean, defaultValue: false },
        sideImage: { type: Boolean, defaultValue: false },
        centeredContent: { type: Boolean, defaultValue: false },
        imageOverlay: { type: Boolean, defaultValue: false }
      },
      render: (
        {
          title,
          subtitle,
          content,
          image,
          footerContent,
          color,
          compact,
          bordered,
          sideImage,
          centeredContent,
          imageOverlay
        },
        { html }
      ) => {
        const bgClass = BgColor[color];
        const textColorClass = color === "base-100" ? "" : TextColor[color];
        const compactClass = compact ? "card-compact" : "";
        const borderedClass = bordered ? "card-bordered" : "";
        const sideImageClass = sideImage ? "card-side" : "";
        const centeredContentClass = centeredContent
          ? "items-center text-center"
          : "";
        const imageOverlayClass = imageOverlay ? "image-full" : "";

        return html`
          <div
            class="card ${bgClass} ${textColorClass} ${compactClass} ${borderedClass} ${sideImageClass} ${imageOverlayClass} shadow-xl"
          >
            ${image
    ? html` <figure><img src=${image} alt="Card Image" /></figure> `
    : ""}
            <div class="card-body ${centeredContentClass}">
              <h2 class="card-title">${title}</h2>
              ${subtitle ? html`<h3 class="subtitle">${subtitle}</h3>` : ""}
              <p>${content}</p>
              ${footerContent
    ? html`
                    <div class="justify-end card-actions">${footerContent}</div>
                  `
    : ""}
            </div>
          </div>
        `;
      }
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
        vertical: { type: Boolean, defaultValue: false },
        indicatorButtons: {
          type: Boolean,
          defaultValue: false
        },
        navigationButtons: {
          type: Boolean,
          defaultValue: false
        }
      },
      render: (
        { items, alignment, vertical, indicatorButtons, navigationButtons },
        { html }
      ) => {
        const AlignmentClasses = {
          start: "carousel-start",
          center: "carousel-center",
          end: "carousel-end"
        };

        const alignmentClass = AlignmentClasses[alignment];
        const directionClass = vertical && "carousel-vertical";
        let carouselItems = items.map((item, index) => {
          return html`
            <div id="item${index}" class="carousel-item">
              <img src=${item.src} alt=${item.alt} />
              ${navigationButtons
    ? html`
                    <div
                      class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
                    >
                      <a href="#item${index - 1}" class="btn btn-circle">❮</a>
                      <a href="#item${index + 1}" class="btn btn-circle">❯</a>
                    </div>
                  `
    : ""}
            </div>
          `;
        });

        return html`
          <div class="carousel ${alignmentClass} ${directionClass} rounded-box">
            ${carouselItems}
          </div>
          ${indicatorButtons
    ? html`
                <div class="flex justify-center w-full py-2 gap-2">
                  ${items.map(
    (_, index) =>
      html`<a href="#item${index}" class="btn btn-xs"
                        >${index + 1}</a
                      >`
  )}
                </div>
              `
    : ""}
        `;
      }
    },
    "uix-collapse": {
      props: {
        method: {
          type: String,
          defaultValue: "focus",
          enum: ["focus", "checkbox", "details"]
        }, // Method of collapsing.
        color: { type: String, defaultValue: "base", enum: Colors }, // Color color.
        title: { type: String, defaultValue: "Click to open/close" }, // Title of the collapse.
        content: { type: String, defaultValue: "Collapse Content" }, // Content of the collapse.
        icon: { type: String, defaultValue: "", enum: ["", "arrow", "plus"] }, // Icon for the collapse (if any).
        isOpen: { type: Boolean, defaultValue: false } // Determines if the collapse is initially open or closed.
      },
      render: ({ method, color, title, content, icon, isOpen }, { html }) => {
        const baseClass = `collapse ${CollapseBgColor[color]}`;
        const iconClass = CollapseIcon[icon];
        const openClass = isOpen ? "collapse-open" : "";

        if (method === "focus") {
          return html`
            <div tabindex="0" class="${baseClass} ${iconClass} ${openClass}">
              <div class="collapse-title text-xl font-medium">${title}</div>
              <div class="collapse-content">${content}</div>
            </div>
          `;
        } else if (method === "checkbox") {
          return html`
            <div class="${baseClass}">
              <input type="checkbox" class="peer" />
              <div class="collapse-title text-xl font-medium ${iconClass}">
                ${title}
              </div>
              <div class="collapse-content">${content}</div>
            </div>
          `;
        } else {
          return html`
            <details class="${baseClass}">
              <summary class="collapse-title text-xl font-medium">
                ${title}
              </summary>
              <div class="collapse-content">${content}</div>
            </details>
          `;
        }
      }
    },
    "uix-kbd": {
      props: {
        keyContent: { type: String, defaultValue: "Key" },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
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
      }
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
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          return { days, hours, minutes, seconds };
        };

        const countdown = calculateCountdown(endDate);

        const formattedCountdown = format.split("").map((f) => {
          switch (f) {
          case "D":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.days};"></span>days</span
              >`;
          case "H":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.hours};"></span>hours</span
              >`;
          case "M":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.minutes};"></span
                >minutes</span
              >`;
          case "S":
            return html`<span class="font-mono text-4xl countdown"
                ><span style="--value:${countdown.seconds};"></span
                >seconds</span
              >`;
          default:
            return "";
          }
        });

        return html` <div class="countdown">${formattedCountdown}</div> `;
      }
    },
    "uix-divider": {
      props: {
        thickness: { type: String, defaultValue: "1px" },
        color: {
          type: String,
          defaultValue: "primary",
          enum: Colors
        },
        text: { type: String, defaultValue: "" },
        vertical: { type: Boolean, defaultValue: false },
        responsive: { type: Boolean, defaultValue: false },
        class: { type: String, default: "" }
      },

      render: (props, { html }) => {
        const { thickness, color, vertical, responsive } = props;
        const baseClass = [
          "divider",
          vertical ? "divider-vertical" : "divider-horizontal",
          responsive &&
            (vertical ? "lg:divider-horizontal" : "lg:divider-vertical"),
          BgColor[color],
          props.class
        ]
          .filter((c) => !!c)
          .join(" ");

        return html`
          <div class=${baseClass} style="height: ${thickness};">
            <slot></slot>
          </div>
        `;
      }
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
              @change=${toggleDrawer}
            />
            <div
              class="flex flex-col items-center justify-center drawer-content"
            >
              <label
                for="uix-drawer-toggle"
                class="btn btn-primary drawer-button"
                @click=${toggleDrawer}
              >
                <uix-icon name="menu" class="w-4 h-4 mr-2"></uix-icon>
                Open drawer
              </label>
            </div>
            <div class="drawer-side h-full absolute">
              <label
                for="uix-drawer-toggle"
                class="drawer-overlay"
                @click=${toggleDrawer}
              ></label>
              <slot></slot>
            </div>
          </div>
        `;
      }
    },
    "uix-dropdown": {
      props: {
        label: { type: String, defaultValue: "Click" },
        items: { type: Array, defaultValue: [] },
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
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
        forceOpen: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false }
      },
      render: (
        {
          label,
          items,
          color,
          rounded,
          method,
          position,
          isOpen,
          openOnHover,
          forceOpen,
          setIsOpen
        },
        { html }
      ) => {
        const bgColorClass = BgColor[color];
        const textColorClass = TextColor[color];
        return html`
          <div
            class="dropdown ${position === "end"
    ? "dropdown-end"
    : ""} ${openOnHover ? "dropdown-hover" : ""} ${forceOpen
  ? "dropdown-open"
  : ""}"
          >
            ${method === "details"
    ? html`
                  <details class="${bgColorClass} ${textColorClass} mb-32">
                    <summary class="m-1 btn">${label}</summary>
                    <ul
                      class="p-2 shadow menu dropdown-content z-[1] ${bgColorClass} ${(rounded &&
                        "rounded-box") ||
                      ""} w-52"
                    >
                      ${items.map((item) => html`<li><a>${item}</a></li>`)}
                    </ul>
                  </details>
                `
    : html`
                  <label
                    tabindex="0"
                    class="m-1 btn"
                    @click=${() => setIsOpen(!isOpen)}
                    >${label}</label
                  >
                  ${isOpen
    ? html`
                        <ul
                          tabindex="0"
                          class="p-2 shadow menu dropdown-content z-[1] ${bgColorClass} ${(rounded &&
                            "rounded-box") ||
                          ""} w-52"
                        >
                          ${items.map((item) => html`<li><a>${item}</a></li>`)}
                        </ul>
                      `
    : ""}
                `}
          </div>
        `;
      }
    },
    "uix-modal": {
      props: {
        actions: { type: Function, defaultValue: () => {} },
        parent: { type: Object, defaultValue: null },
        title: { type: String, defaultValue: "" },
        content: { type: String, defaultValue: "" },
        openButton: { type: Function, defaultValue: null },
        name: { type: String, defaultValue: "uix-modal" },
        position: {
          type: String,
          defaultValue: "middle",
          enum: ["top", "middle", "bottom"]
        },
        icon: { type: String, defaultValue: "" }
      },
      firstUpdated: (host) => {
        host.$modal = host.shadowRoot.querySelector("#modal");
      },
      render: (host, { html }) => {
        const { parent, actions, title, position, openButton, icon } = host;
        const closeModal = (msg = "") => host.$modal.close(msg);
        if (parent) {
          parent.closeModal = closeModal;
        }
        const modalClass = `modal ${
          ModalPositions[position] || ModalPositions.middle
        }`;
        const openclick = () => {
          host.$modal.showModal();
        };

        return html`
          ${
  openButton
    ? openButton(openclick)
    : html`<button @click=${openclick}>open</button>`
}

          <dialog id="modal" class=${modalClass}>            
            <div class="modal-box">
              <uix-list vertical>
                <uix-list class="modal-title">
                ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
                <uix-text size="lg">${title || ""}</uix-text>
              </uix-list>
              <form method="dialog" id="form">
                <slot></slot>

                <div class="modal-action">

                <uix-button
                .click=${() => closeModal()}
                  variant="ghost"
                  shape="circle"
                  size="sm"
                  class="absolute right-2 top-2"
                >
                  ✕
                </button>
                  <slot name="footer"></slot>
                  ${actions({ host }) || ""}
                </div>
              </form>
</uix-list>
            </div>
          </dialog>
        `;
      }
    },
    "uix-mask": {
      props: {
        variant: { type: String, defaultValue: "squircle" },
        src: String
      },
      render: ({ variant, src }, { html }) => {
        return html`<img class="mask ${variant}" src=${src} />`;
      }
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
          enum: Colors
        }
      },
      render: ({ isVisible, message, type, size, color }, { html }) => {
        if (!isVisible) return html``;
        const Loading = {
          spinner: "loading loading-spinner",
          dots: "loading loading-dots",
          ring: "loading loading-ring",
          ball: "loading loading-ball",
          bars: "loading loading-bars",
          infinity: "loading loading-infinity"
        };
        const LoadingSize = {
          lg: "loading-lg",
          md: "loading-md",
          sm: "loading-sm",
          xs: "loading-xs"
        };

        const loadingClass = `${Loading[type]} ${LoadingSize[size]} ${TextColor[color]}`;

        return html`
          <span class="${loadingClass}">
            ${message ? html`<span>${message}</span>` : ""}
            ${message && type === "spinner"
    ? html`<uix-icon name="spinner"></uix-icon>`
    : ""}
          </span>
        `;
      }
    },
    "uix-mockup-code": {
      props: {
        prefix: {
          type: String,
          defaultValue: ""
        },
        code: {
          type: String,
          defaultValue: ""
        },
        highlight: {
          type: Boolean,
          defaultValue: false
        },
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        }
      },
      render: ({ prefix, code, highlight, color }, { html }) => {
        const colorSchema = color
          ? [BgColor[color], TextColor[color]].join(" ")
          : "";
        const highlightClass = highlight ? colorSchema : "";

        return html`
          <div class="mockup-code ${colorSchema}">
            <pre
              class="${highlightClass}"
              data-prefix="${prefix}"
            ><code>${code}</code></pre>
          </div>
        `;
      }
    },
    "uix-block": {
      props: {
        color: {
          type: String,
          defaultValue: "",
          enum: Colors
        },
        bgColor: {
          type: String,
          defaultValue: ""
        },
        textColor: {
          type: String,
          defaultValue: ""
        },
        spacing: {
          type: Number,
          defaultValue: "md"
        },
        rounded: {
          type: Boolean,
          defaultValue: false
        },
        shadow: {
          type: Boolean,
          defaultValue: false
        },
        class: {
          type: String,
          defaultValue: ""
        }
      },
      render: (props, { html }) => {
        const { color, bgColor, textColor, spacing, rounded, shadow } = props;
        const BlockColors = {
          primary: "bg-primary text-primary-content",
          secondary: "bg-secondary text-secondary-content",
          accent: "bg-accent text-accent-content",
          neutral: "bg-neutral text-neutral-content",
          base: "bg-base text-base-content",
          info: "bg-info text-info-content",
          success: "bg-success text-success-content",
          warning: "bg-warning text-warning-content",
          error: "bg-error text-error-content"
        };

        const SpacingSizes = {
          xs: "p-1",
          sm: "p-2",
          md: "p-4",
          lg: "p-6",
          xl: "p-8",
          "2xl": "p-12",
          "3xl": "p-16",
          "4xl": "p-24"
        };

        const bgClass = bgColor ? `bg-${bgColor}` : "";
        const textClass = textColor ? `text-${textColor}` : "";
        const spacingClass = SpacingSizes[spacing || "md"];
        const colorClass = BlockColors[color];
        const roundedClass = rounded ? "rounded" : "";
        const shadowClass = shadow ? "shadow-md" : "";

        return html`
          <div
            class="${spacingClass} ${colorClass} ${bgClass} ${textClass} ${roundedClass} ${shadowClass} ${props.class}"
          >
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-menu-item": {
      props: {
        icon: { type: String, defaultValue: "" },
        label: { type: String, defaultValue: "" },
        click: { type: Function, default: () => {} },
        href: { type: String, defaultValue: "" },
        type: { type: String, defaultValue: "" },
        variant: { type: String, defaultValue: "" },
        active: { type: Boolean, defaultValue: false },
        classes: { type: Object, defaultValue: {} },
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        }
      },

      render: (
        {
          active,
          classes = {},
          click,
          color,
          icon,
          href,
          label,
          type,
          variant
        },
        { html }
      ) => {
        const { item: itemClass = "" } = classes;
        const activeClass = active ? "active" : "";
        const menuItemClasses = `${itemClass} ${activeClass} items-center gap-2 px-4`;

        return html`
          <li>
            <uix-button
              .click=${click}
              href=${href}
              icon=${icon}
              variant=${variant}
              class=${menuItemClasses}
              color=${color}
              label=${label}
              type=${type}
            >
            </uix-button>
          </li>
        `;
      }
    },
    "uix-menu": {
      props: {
        items: { type: Array, defaultValue: [] },
        title: { type: String, defaultValue: null },
        color: { type: String, defaultValue: "", enum: Colors },
        vertical: { type: Boolean, defaultValue: false },
        size: { type: String, defaultValue: "md", enum: Sizes },
        gap: { type: String, defaultValue: "md", enum: Sizes },
        click: { type: Function, default: () => {} },
        isActive: { type: Boolean, defaultValue: false },
        isCollapsible: { type: Boolean, defaultValue: false },
        iconOnly: { type: Boolean, defaultValue: false },
        width: "",
        height: "",
        fullHeight: { type: Boolean, defaultValue: false },
        fullWidth: { type: Boolean, defaultValue: false },
        rounded: { type: Boolean, defaultValue: false },
        classes: { type: Object, defaultValue: {} }
      },
      render: (props, { html }) => {
        const {
          classes = {},
          items,
          title,
          color,
          fullHeight,
          gap,
          fullWidth,
          height,
          width,
          vertical,
          rounded,
          size,
          isActive
        } = props;
        const { container: containerClass } = classes || {};
        const { items: itemsClass } = classes;
        const baseClass = [
          "menu",
          BgColor[color],
          height || "",
          width || "",
          MenuSize[size],
          Gaps[gap],
          fullHeight && "h-full",
          fullWidth && "w-full",
          vertical ? "menu-vertical" : "menu-horizontal",
          rounded && "rounded-box",
          containerClass
        ]
          .filter((c) => !!c)
          .join(" ");

        const itemClass = [
          "flex flex-row items-center",
          itemsClass,
          (isActive && "active") || ""
        ]
          .filter((c) => !!c)
          .join(" ");

        return html`
          <ul class=${baseClass}>
            ${title ? html`<li class="menu-title">${title}</li>` : ""}
            ${items.map((item) => {
    const { submenu } = item;
    if (submenu) {
      return html`
                  <details ?open=${!!item.open}>
                    <summary class="cursor-pointer gap-2 ${itemClass}">
                      ${item.icon
    ? html`<uix-icon name=${item.icon}></uix-icon>`
    : ""}
                      ${item.label || ""}
                    </summary>
                    <uix-menu
                      .items=${submenu}
                      ?vertical=${vertical}
                    ></uix-menu>
                  </details>
                `;
    } else {
      return html`<uix-menu-item
                  .classes=${{ item: itemClass }}
                  .click=${item.click}
                  icon=${item.icon}
                  variant=${item.variant}
                  label=${item.label}
                  type=${item.type}
                  href=${item.href}
                  active=${isActive}
                ></uix-menu-item>`;
    }
  })}
          </ul>
        `;
      }
    },
    "uix-tooltip": {
      props: {
        content: { type: String, defaultValue: "Tooltip Content" },
        position: { type: String, defaultValue: "top", enum: Positions },
        trigger: { type: String, defaultValue: "hover", enum: Triggers },
        isOpen: { type: Boolean, defaultValue: false },
        color: { type: String, defaultValue: "primary", enum: Colors }
      },
      render: (
        { content, position, trigger, isOpen, setIsOpen, color },
        { html }
      ) => {
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
              @onmouseleave=${() => setIsOpen(false)}
            >
              ${content}
            </uix-button>
          </div>
        `;
      }
    },
    "uix-toast": {
      props: {
        content: {
          type: Array,
          defaultValue: [{ message: "Default Message", type: "info" }]
        }, // Assuming a list of alerts
        duration: { type: Number, defaultValue: 3000 },
        horizontalPosition: {
          type: String,
          defaultValue: "end",
          enum: Positions
        },
        verticalPosition: {
          type: String,
          defaultValue: "bottom",
          enum: Positions
        }
      },
      render: (
        { content, duration, horizontalPosition, verticalPosition },
        { html }
      ) => {
        const ToastPositionHorizontalClass = {
          start: "toast-start",
          center: "toast-center",
          end: "toast-end",
          left: "toast-left",
          right: "toast-right",
          "top-right": "toast-top-right",
          "top-left": "toast-top-left",
          "bottom-right": "toast-bottom-right",
          "bottom-left": "toast-bottom-left"
        };

        const ToastPositionVerticalClass = {
          top: "toast-top",
          middle: "toast-middle",
          bottom: "toast-bottom",
          "top-end": "toast-top-end",
          "bottom-middle": "toast-bottom-middle"
        };
        const AlertTypes = {
          info: "alert-info",
          success: "alert-success",
          warning: "alert-warning",
          error: "alert-error"
        };

        const horizontalClass =
          ToastPositionHorizontalClass[horizontalPosition] || "";
        const verticalClass =
          ToastPositionVerticalClass[verticalPosition] || "";

        return html`
          <div
            class="toast ${horizontalClass} ${verticalClass}"
            style="animation-duration: ${duration}ms;"
          >
            ${content.map(
    (alert) => html`
                <div class="alert ${AlertTypes[alert.type || "info"]}">
                  ${alert.icon
    ? html`<uix-icon name=${alert.icon}></uix-icon>`
    : ""}
                  <span>${alert.message}</span>
                </div>
              `
  )}
          </div>
        `;
      }
    },
    "uix-artboard": {
      // TODO: expand daisyUI tags as the JIT can't get dynamic ones
      props: {
        content: { type: String, defaultValue: "Artboard Content" },
        demo: { type: Boolean, defaultValue: false }, // artboard-demo for shadow, radius, and centering
        size: { type: Number, defaultValue: 1, enum: [1, 2, 3, 4, 5, 6] },
        horizontal: { type: Boolean, defaultValue: false }
      },
      render: ({ content, size, horizontal, demo }, { html }) => {
        const PhoneSize = {
          1: "phone-1",
          2: "phone-2",
          3: "phone-3",
          4: "phone-4",
          5: "phone-5",
          6: "phone-6"
        };
        const sizeClass = PhoneSize[size];
        const directionClass = horizontal ? "artboard-horizontal" : "";
        const demoClass = demo ? "artboard-demo" : "";
        return html`
          <div class="artboard ${sizeClass} ${directionClass} ${demoClass}">
            ${content}
          </div>
        `;
      }
    },
    "uix-stack": {
      props: {
        vertical: { type: Boolean, defaultValue: false },
        gap: {
          type: String,
          defaultValue: "md",
          enum: Spacings
        }
      },
      render: ({ vertical, gap }, { html }) => {
        const gapClass = Gaps[gap] || "";
        const directionClass = vertical ? "flex-col" : "flex-row";
        return html`
          <div class="stack flex ${directionClass} ${gapClass}">
            <slot></slot>
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
        valueColor: { type: String, defaultValue: "default", enum: Colors },
        descColor: { type: String, defaultValue: "default", enum: Colors }
      },
      render: (
        { title, value, desc, figure, valueColor, descColor },
        { html }
      ) => {
        const valueColorClass = `text-${valueColor}-focus`;
        const descColorClass = `text-${descColor}-focus`;
        return html`
          <div class="stat">
            ${figure
    ? html`<div class="stat-figure ${valueColorClass}">
                  ${figure}
                </div>`
    : ""}
            <div class="stat-title">${title}</div>
            <div class="stat-value ${valueColorClass}">${value}</div>
            <div class="stat-desc ${descColorClass}">${desc}</div>
          </div>
        `;
      }
    },
    "uix-list": {
      props: {
        vertical: { type: Boolean, defaultValue: false },
        responsive: { type: Boolean, defaultValue: false },
        gap: {
          type: String,
          defaultValue: "sm",
          enum: Sizes
        },
        rounded: { type: Boolean, defaultValue: false },
        alignX: {
          type: String,
          enum: Object.keys(AlignX),
          defaultValue: ""
        },
        alignY: {
          type: String,
          enum: Object.keys(AlignY),
          defaultValue: ""
        },
        class: {
          type: String,
          defaultValue: ""
        }
      },
      render: (props, { html }) => {
        const { vertical, gap, responsive, rounded, alignX, alignY } = props;
        const directionClass = vertical ? "flex-col" : "flex-row";
        const responsiveClass =
          (responsive &&
            (vertical
              ? "lg:flex-col sm:flex-row"
              : "sm:flex-col lg:flex-row")) ||
          "";
        const borderRadiusClass = rounded
          ? "rounded-l-full rounded-r-full"
          : "";
        const gapClass = Gaps[gap] || "";
        const alignXClass = alignX ? "w-full " + AlignX[alignX] : "";
        const alignYClass = alignY ? "h-full " + AlignY[alignY] : "";

        return html`
          <div
            class=${[
    "flex",
    gapClass,
    directionClass,
    responsiveClass,
    borderRadiusClass,
    alignXClass,
    alignYClass,
    props.class
  ]
    .filter((cls) => !!cls)
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      }
    },
    "uix-grid": {
      props: {
        templateColumns: { type: String, defaultValue: "1fr" },
        templateRows: { type: String, defaultValue: "" },
        gap: { type: String, defaultValue: "sm", enum: Sizes },
        rounded: { type: Boolean, defaultValue: false },
        alignX: { type: String, enum: Object.keys(AlignX), defaultValue: "" },
        alignY: { type: String, enum: Object.keys(AlignY), defaultValue: "" }
      },
      render: (
        { templateColumns, templateRows, gap, rounded, alignX, alignY },
        { html }
      ) => {
        const borderRadiusClass = rounded
          ? "rounded-l-full rounded-r-full"
          : "";
        const gapClass = Gaps[gap] || "";
        const columnsClass = `grid-cols-${templateColumns}`;
        const rowsClass = templateRows ? `grid-rows-${templateRows}` : "";
        const alignXClass = alignX ? AlignX[alignX] : "";
        const alignYClass = alignY ? AlignY[alignY] : "";

        return html`
          <div
            class=${[
    "grid",
    gapClass,
    columnsClass,
    rowsClass,
    borderRadiusClass,
    alignXClass,
    alignYClass
  ]
    .filter((cls) => !!cls)
    .join(" ")}
          >
            <slot></slot>
          </div>
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
        type: {
          type: String,
          defaultValue: "default",
          enum: ["default", "boxed", "bordered", "lifted"]
        },
        size: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        },
        gap: {
          type: String,
          defaultValue: "md",
          enum: Sizes
        }
      },
      render: (
        { items, selectedValue, setSelectedValue, type, size, gap },
        { html }
      ) => {
        let selected = selectedValue;

        const getTabClass = (item) => {
          return [
            "tab",
            item.label === selected && "tab-active",
            item.disabled && "tab-disabled",
            type === "bordered" && "tab-bordered",
            type === "lifted" && "tab-lifted",
            Sizes.includes(size) && TabsSize[size]
          ]
            .filter((cls) => !!cls)
            .join(" ");
        };
        const gapClass = Gaps[gap] || "";

        return html`
          <div
            class=${`tabs ${type === "boxed" ? "tabs-boxed" : ""} ${gapClass}`}
          >
            ${items.map(
    (item) => html`
                <button
                  @click=${() => setSelectedValue(item.label)}
                  class=${getTabClass(item)}
                  role="tab"
                >
                  ${item.icon
    ? html`<uix-icon name=${item.icon}></uix-icon>`
    : ""}
                  ${item.label}
                </button>
              `
  )}
          </div>
        `;
      }
    },
    "uix-progress": {
      // TODO: expand daisyui tags
      props: {
        value: { type: Number, defaultValue: 0 },
        max: { type: Number, defaultValue: 100 },
        width: { type: String, defaultValue: "w-56" },
        color: {
          type: String,
          defaultValue: "base",
          enum: Colors
        }
      },
      render: ({ value, max, width, color }, { html }) => {
        const progressClass = `progress ${width}`;
        const colorClass = color !== "base" ? `progress-${color}` : "";
        return html`
          <progress
            class="${progressClass} ${colorClass}"
            value="${value}"
            max="${max}"
          ></progress>
        `;
      }
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
          defaultValue: "0.4rem"
        },
        color: {
          type: String,
          defaultValue: "primary",
          enum: Colors
        },
        backgroundColor: {
          type: String,
          defaultValue: "default"
        },
        borderColor: {
          type: String,
          defaultValue: "default"
        },
        borderWidth: {
          type: String,
          defaultValue: "0px"
        },
        textColor: {
          type: String,
          defaultValue: "default-content"
        }
      },
      render: (
        {
          value,
          size,
          thickness,
          color,
          backgroundColor,
          borderColor,
          borderWidth,
          textColor
        },
        { html }
      ) => {
        const textStyle = `text-${textColor}`;
        const bgColor =
          backgroundColor !== "default" ? BgColor[backgroundColor] : "";
        const borderColorStyle =
          borderColor !== "default"
            ? `border-${borderWidth} ${BorderColor[borderColor]}`
            : "";
        const textSizeStyle = `text-${color}`;
        return html`
          <div
            class="radial-progress ${textSizeStyle} ${bgColor} ${borderColorStyle} ${textStyle}"
            style="--value:${value}; --size:${size}; --thickness:${thickness};"
          >
            ${value}%
          </div>
        `;
      }
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
                ${headers.map((header) => html`<th>${header}</th>`)}
              </thead>
              <tbody>
                ${rows.map(
    (row) => html`
                    <tr>
                      ${row.map((cell) => html`<td>${cell}</td>`)}
                    </tr>
                  `
  )}
              </tbody>
            </table>
          </div>
        `;
      }
    },
    "uix-steps": {
      // TODO: expand daisyui tags
      props: {
        steps: {
          type: Array,
          defaultValue: [],
          enum: Colors
        }, // Array of objects with properties: label, icon, color.
        vertical: { type: Boolean, defaultValue: false },
        responsive: { type: Boolean, defaultValue: false },
        scrollable: { type: Boolean, defaultValue: false }
      },
      render: ({ steps, responsive, vertical, scrollable }, { html }) => {
        const directionClass = vertical ? "steps-vertical" : "steps-horizontal";
        const responsiveClass =
          responsive &&
          (vertical ? "lg:steps-vertical" : "lg:steps-horizontal");
        const wrapperClass = scrollable ? "overflow-x-auto" : "";

        return html`
          <div class="${wrapperClass}">
            <ul
              class=${["steps", directionClass, responsiveClass]
    .filter((c) => !!c)
    .join(" ")}
            >
              ${steps.map((step) => {
    const stepClass = `step step-${step.color}`;
    return step.icon
      ? html`<li class="${stepClass}">
                      <uix-icon name="${step.icon}"></uix-icon> ${step.label}
                    </li>`
      : html`<li class="${stepClass}">${step.label}</li>`;
  })}
            </ul>
          </div>
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
          enum: Positions.filter((p) => ["start", "center", "end"].includes(p))
        },
        verticalPosition: {
          type: String,
          defaultValue: "top",
          enum: Positions.filter((p) => ["top", "middle", "bottom"].includes(p))
        },
        responsivePositions: {
          type: Object,
          defaultValue: {}
        },
        badgeColor: {
          type: String,
          defaultValue: "secondary",
          enum: Colors
        }
      },
      render: (
        {
          content,
          badge,
          horizontalPosition,
          verticalPosition,
          responsivePositions,
          badgeColor
        },
        { html }
      ) => {
        const colorClass = `badge-${badgeColor}`;
        let positionClasses = `indicator-item indicator-${horizontalPosition} indicator-${verticalPosition}`;

        Resolutions.forEach((res) => {
          if (responsivePositions[res]) {
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
      }
    }
  }
};
