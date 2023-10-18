import T from "bootstrapp-shared/types.mjs";
import { html } from "lit";
import {
  Positions,
  TabsSize,
  Gaps,
  MenuSize,
  ModalPositions,
  Sizes,
  Colors,
  BgColor,
  TextColor,
  CollapseBgColor,
  CollapseIcon,
} from "../uix.theme.mjs";

export default {
  views: {
    "uix-accordion": {
      props: {
        items: T.array(),
        color: T.string({ defaultValue: "base", enum: Colors }),
        method: T.string({
          defaultValue: "focus",
          enum: ["focus", "checkbox", "details"],
        }),
        icon: T.string({
          defaultValue: "",
          enum: ["", "arrow", "plus"],
        }),
      },
      render: ({ items, color, method, icon }) => {
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
            `,
  )}
        `;
      },
    },
    "uix-breadcrumbs": {
      props: {
        items: T.array({
          defaultValue: [],
          format: [
            {
              label: T.string(),
              href: T.string(),
              icon: T.string(),
            },
          ],
        }),
        separator: T.string({ defaultValue: "/" }),
      },
      render: ({ content, color, outline, size, icon }) => {
        const BadgeSizes = {
          lg: "badge-lg",
          md: "",
          sm: "badge-sm",
          xs: "badge-xs",
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
      },
    },
    "uix-bottom-navigation": {
      props: {
        items: T.array(),
        activeIndex: T.number({ defaultValue: 0 }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
      },
      render: ({ items, activeIndex, size }) => {
        const BtmClasses = {
          md: "btm-nav-md",
          sm: "btm-nav-sm",
          lg: "btm-nav-lg",
          xl: "btm-nav-xl",
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
      },
    },
    "uix-carousel": {
      props: {
        items: T.array(),
        alignment: T.string({
          defaultValue: "start",
          enum: ["start", "center", "end"],
        }),
        vertical: T.boolean(),
        indicatorButtons: T.boolean(),
        navigationButtons: T.boolean(),
      },
      render: ({
        items,
        alignment,
        vertical,
        indicatorButtons,
        navigationButtons,
      }) => {
        const AlignmentClasses = {
          start: "carousel-start",
          center: "carousel-center",
          end: "carousel-end",
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
                      >`,
  )}
                </div>
              `
    : ""}
        `;
      },
    },
    "uix-collapse": {
      props: {
        method: T.string({
          defaultValue: "focus",
          enum: ["focus", "checkbox", "details"],
        }),
        color: T.string({ defaultValue: "base", enum: Colors }),
        title: T.string({ defaultValue: "Click to open/close" }),
        content: T.string({ defaultValue: "Collapse Content" }),
        icon: T.string({
          defaultValue: "",
          enum: ["", "arrow", "plus"],
        }),
        open: T.boolean(),
      },
      render: ({ method, color, title, content, icon, open }) => {
        const baseClass = `collapse ${CollapseBgColor[color]}`;
        const iconClass = CollapseIcon[icon];
        const openClass = open ? "collapse-open" : "";

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
      },
    },
    "uix-drawer": {
      props: {
        open: T.boolean(),
        position: T.string({ defaultValue: "left", enum: Positions }),
        setOpen: T.function({ defaultValue: null }),
      },
      render: ({ open, position, setOpen }) => {
        const positionClass = position === "right" ? "drawer-end" : "";
        const toggleDrawer = () => {
          if (setOpen) {
            setOpen(!open);
          }
        };

        return html`
          <div class="drawer ${positionClass}">
            <input
              id="uix-drawer-toggle"
              type="checkbox"
              class="drawer-toggle"
              ?checked=${open}
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
      },
    },
    "uix-dropdown": {
      props: {
        label: T.string({ defaultValue: "Click" }),
        items: T.array(),
        color: T.string({ defaultValue: "", enum: Colors }),
        isOpen: T.boolean(),
        rounded: T.boolean({ defaultValue: true }),
      },
      close: function () {
        const $dropdown = this.shadowRoot.querySelector("details");
        $dropdown?.removeAttribute("open");
      },
      render: (host) => {
        const { label, items, color, rounded, position } = host;
        const bgColorClass = BgColor[color];
        const textColorClass = TextColor[color];

        const baseClass = [
          "dropdown",
          position === "end" ? "dropdown-end" : "",
          bgColorClass,
          textColorClass,
        ]
          .filter(Boolean)
          .join(" ");
        return html`
          <details id="dropdown" class=${baseClass}>
            <summary class="btn">${label}</summary>
            <ul
              class="p-2 shadow menu dropdown-content z-[1] ${bgColorClass} ${(rounded &&
                "rounded-box") ||
              ""} w-52"
            >
              ${items.map((item) => {
    const click = (e) => {
      host.close();
      item?.click?.(e);
    };
    return html`<li>
                  <a @click=${click} href=${item.href || "#"}>${item.label}</a>
                </li>`;
  })}
            </ul>
          </details>
        `;
      },
    },
    "uix-modal": {
      props: {
        actions: T.function(),
        parent: T.object(),
        title: T.string(),
        content: T.string(),
        openButton: T.function(),
        name: T.string({ defaultValue: "uix-modal" }),
        position: T.string({
          defaultValue: "middle",
          enum: ["top", "middle", "bottom"],
        }),
        icon: T.string(),
      },
      firstUpdated: function () {
        this.$modal = this.shadowRoot.querySelector("#modal");
      },
      render: (host) => {
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
          ${openButton
    ? openButton(openclick)
    : html`<button @click=${openclick}>open</button>`}

          <dialog id="modal" class=${modalClass}>
            <div class="modal-box">
              <uix-list vertical>
                <uix-list class="modal-title">
                  ${icon ? html`<uix-icon name=${icon}></uix-icon>` : ""}
                  <uix-text size="lg">${title || ""}</uix-text>
                </uix-list>
                <form method="dialog" id="form">
                  <slot></slot>

                  <uix-button
                    .click=${() => closeModal()}
                    variant="ghost"
                    shape="circle"
                    size="sm"
                    class="absolute right-2 top-2"
                  >
                    ✕
                  </uix-button>

                  <uix-list>
                    <slot name="footer"></slot>
                    ${actions?.({ host }) || ""}
                  </uix-list>
                </form>
              </uix-list>
            </div>
          </dialog>
        `;
      },
    },
    "uix-menu-item": {
      props: {
        icon: T.string(),
        iconOnly: T.boolean(),
        label: T.string(),
        click: T.function(),
        href: T.string(),
        type: T.string(),
        variant: T.string(),
        active: T.boolean(),
        size: T.string({ defaultValue: "base", enum: Sizes }),
        classes: T.object(),
        color: T.string({ defaultValue: "", enum: Colors }),
        dropdown: T.array(),
      },

      render: ({
        active,
        classes = {},
        click,
        color,
        dropdown,
        icon,
        iconOnly,
        size,
        href,
        label,
        type,
        variant,
      }) => {
        const { item: itemClass = "" } = classes;
        const activeClass = active ? "active" : "";
        const menuItemClasses = `${itemClass} ${activeClass} items-center`;

        return html`
          <li>
            ${dropdown
    ? html`<uix-dropdown
                  .click=${click}
                  href=${href}
                  icon=${icon}
                  variant=${variant}
                  class=${menuItemClasses}
                  color=${color}
                  label=${iconOnly ? undefined : label}
                  type=${type}
                  .items=${dropdown}
                ></uix-dropdown>`
    : html`<uix-button
                  .click=${click}
                  href=${href}
                  icon=${icon}
                  variant=${variant}
                  size=${size}
                  class=${menuItemClasses}
                  color=${color}
                  label=${iconOnly ? undefined : label}
                  type=${type}
                >
                </uix-button>`}
          </li>
        `;
      },
    },
    "uix-menu": {
      props: {
        items: T.array(),
        title: T.string({ defaultValue: null }),
        color: T.string({ defaultValue: "", enum: Colors }),
        vertical: T.boolean(),
        size: T.string({ defaultValue: "base", enum: Sizes }),
        gap: T.string({ defaultValue: "md", enum: Sizes }),
        click: T.function({ default: () => {} }),
        isActive: T.boolean(),
        isCollapsible: T.boolean(),
        iconOnly: T.boolean(),
        width: T.string(),
        height: T.string(),
        fullHeight: T.boolean(),
        fullWidth: T.boolean(),
        rounded: T.boolean(),
        containerClass: T.string(),
        classes: T.object({ defaultValue: {} }),
      },
      render: (props) => {
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
          iconOnly,
          vertical,
          rounded,
          size,
          isActive,
          containerClass,
        } = props;
        const { items: itemsClass } = classes || {};

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
          containerClass,
        ]
          .filter(Boolean)
          .join(" ");

        const itemClass = [
          "flex flex-row items-center",
          itemsClass,
          (isActive && "active") || "",
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
                      ${iconOnly ? "" : item.label}
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
                  .dropdown=${item.dropdown}
                  label=${item.label}
                  ?iconOnly=${iconOnly}
                  type=${item.type}
                  size=${size}
                  href=${item.href}
                  active=${isActive}
                ></uix-menu-item>`;
    }
  })}
          </ul>
        `;
      },
    },
    "uix-tabs": {
      props: {
        items: T.array(),
        selectedValue: T.string(),
        type: T.string({
          defaultValue: "default",
          enum: ["default", "boxed", "bordered", "lifted"],
        }),
        size: T.string({ defaultValue: "md", enum: Sizes }),
        gap: T.string({ defaultValue: "md", enum: Sizes }),
      },
      render: ({ items, selectedValue, setSelectedValue, type, size, gap }) => {
        let selected = selectedValue;

        const getTabClass = (item) => {
          return [
            "tab",
            item.label === selected && "tab-active",
            item.disabled && "tab-disabled",
            type === "bordered" && "tab-bordered",
            type === "lifted" && "tab-lifted",
            Sizes.includes(size) && TabsSize[size],
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
              `,
  )}
          </div>
        `;
      },
    },
    "uix-steps": {
      // TODO: expand daisyui tags
      props: {
        steps: T.array({ defaultValue: [], enum: Colors }),
        vertical: T.boolean(),
        responsive: T.boolean(),
        scrollable: T.boolean(),
      },
      render: ({ steps, responsive, vertical, scrollable }) => {
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
      },
    },
    "uix-navbar": {
      props: {
        color: T.string({ enum: Colors }),
        shadow: T.boolean(),
        rounded: T.boolean(),
        height: T.string(),
        width: T.string(),
        items: T.array(),
        vertical: T.boolean(),
        size: T.string({ defaultValue: "base", enum: Sizes }),
        gap: T.string({ defaultValue: "md" }),
        label: T.string(),
        iconOnly: T.boolean(),
        icon: T.string(),
        classes: T.object(),
      },
      render: ({
        classes,
        color,
        label,
        size,
        icon,
        iconOnly,
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
      ? "w-full h-16 border-b"
      : "h-full w-72 border-r",
    logoClass,
  ].join(" ")}
                    href="/"
                  >
                    <ion-icon name=${icon} role="img"></ion-icon>
                    ${iconOnly ? "" : html`<h2>${label}</h2>`}
                  </a>
                `
    : ""}
            <uix-menu
              .items=${items}
              containerClass="p-0"
              size=${size}
              .classes=${{
    items: itemsClass,
  }}
              color=${color}
              ?vertical=${vertical}
              ?iconOnly=${iconOnly}
              gap=${gap || "lg"}
            ></uix-menu>
          </div>
        `;
      },
    },
  },
};
