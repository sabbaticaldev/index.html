import {
  Positions,
  TabsSize,
  Gaps,
  MenuSize,
  ModalPositions,
  Methods,
  Sizes,
  Colors,
  BgColor,
  TextColor,
  CollapseBgColor,
  CollapseIcon
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
          .filter(Boolean)
          .join(" ");

        const itemClass = [
          "flex flex-row items-center",
          itemsClass,
          (isActive && "active") || ""
        ]
          .filter(Boolean)
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
            .filter(Boolean)
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
    .filter(Boolean)
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
    }
  }
};
