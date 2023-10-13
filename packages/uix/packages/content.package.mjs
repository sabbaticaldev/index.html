import {
  Positions,
  Resolutions,
  Sizes,
  Triggers,
  Colors,
  BgColor,
  TextColor,
  BorderColor,
} from "../uix.theme.mjs";

export default ({ T, html }) => ({
  views: {
    "uix-alert": {
      props: {
        title: T.string(),
        message: T.string(),
        color: T.string({ enum: Colors }),
        closable: T.boolean(),
        rounded: T.boolean(),
        border: T.boolean(),
        actions: T.array(),
      },
      render: ({
        title,
        message,
        rounded,
        color,
        closable,
        actions,
        border,
      }) => {
        const colorClass = [
          BgColor[color],
          border ? BorderColor[color] : "",
          TextColor[color],
        ]
          .filter(Boolean)
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
                        >`,
  )}
                  </div>
                `
    : ""}
          </div>
        `;
      },
    },
    "uix-alerts-container": {
      // TODO: create a container for alerts that knows how to close alert
      props: {},
      render: () => {
        console.log("NEED TO IMPLEMENT");
        return html`NEED TO IMPLEMENT`;
      },
    },
    "uix-card": {
      props: {
        id: T.string(),
        title: T.string(),
        subtitle: T.string(),
        content: T.string(),
        image: T.string(),
        footerContent: T.string(),
        color: T.string({ defaultValue: "base-100", enum: Colors }),
        compact: T.boolean(),
        bordered: T.boolean(),
        sideImage: T.boolean(),
        centeredContent: T.boolean(),
        imageOverlay: T.boolean(),
      },
      render: (host) => {
        const {
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
          imageOverlay,
        } = host;
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
      },
    },
    "uix-mockup-code": {
      props: {
        prefix: T.string(),
        code: T.string(),
        highlight: T.boolean(),
        color: T.string({ enum: Colors }),
      },
      render: ({ prefix, code, highlight, color }) => {
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
      },
    },
    "uix-tooltip": {
      props: {
        content: T.string({ defaultValue: "Tooltip Content" }),
        position: T.string({ defaultValue: "top", enum: Positions }),
        trigger: T.string({ defaultValue: "hover", enum: Triggers }),
        isOpen: T.boolean(),
        color: T.string({ defaultValue: "primary", enum: Colors }),
      },
      render: ({ content, position, trigger, isOpen, setIsOpen, color }) => {
        const tooltipPositionClass = `tooltip-${position}`;
        const tooltipColorClass = `tooltip-${color}`;

        const tooltipClasses = [
          "tooltip",
          tooltipPositionClass,
          isOpen ? "tooltip-open" : "",
          tooltipColorClass,
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
      },
    },
    "uix-toast": {
      props: {
        content: T.array(),
        duration: T.number({ defaultValue: 3000 }),
        horizontalPosition: T.string({ defaultValue: "end", enum: Positions }),
        verticalPosition: T.string({ defaultValue: "bottom", enum: Positions }),
      },
      render: ({ content, duration, horizontalPosition, verticalPosition }) => {
        const ToastPositionHorizontalClass = {
          start: "toast-start",
          center: "toast-center",
          end: "toast-end",
          left: "toast-left",
          right: "toast-right",
          "top-right": "toast-top-right",
          "top-left": "toast-top-left",
          "bottom-right": "toast-bottom-right",
          "bottom-left": "toast-bottom-left",
        };

        const ToastPositionVerticalClass = {
          top: "toast-top",
          middle: "toast-middle",
          bottom: "toast-bottom",
          "top-end": "toast-top-end",
          "bottom-middle": "toast-bottom-middle",
        };
        const AlertTypes = {
          info: "alert-info",
          success: "alert-success",
          warning: "alert-warning",
          error: "alert-error",
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
              `,
  )}
          </div>
        `;
      },
    },
    "uix-artboard": {
      props: {
        content: T.string({ defaultValue: "Artboard Content" }),
        demo: T.boolean(),
        size: T.number({ defaultValue: 1, enum: [1, 2, 3, 4, 5, 6] }),
        horizontal: T.boolean(),
      },
      render: ({ content, size, horizontal, demo }) => {
        const PhoneSize = {
          1: "phone-1",
          2: "phone-2",
          3: "phone-3",
          4: "phone-4",
          5: "phone-5",
          6: "phone-6",
        };
        const sizeClass = PhoneSize[size];
        const directionClass = horizontal ? "artboard-horizontal" : "";
        const demoClass = demo ? "artboard-demo" : "";
        return html`
          <div class="artboard ${sizeClass} ${directionClass} ${demoClass}">
            ${content}
          </div>
        `;
      },
    },
    "uix-stat": {
      // TODO: expand daisyui tags for tailwind JIT
      props: {
        title: T.string(),
        value: T.string(),
        desc: T.string(),
        figure: T.string(),
        valueColor: T.string({ defaultValue: "default", enum: Colors }),
        descColor: T.string({ defaultValue: "default", enum: Colors }),
      },
      render: ({ title, value, desc, figure, valueColor, descColor }) => {
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
      },
    },
    "uix-table": {
      props: {
        rows: T.array(),
        headers: T.array(),
        zebra: T.boolean(),
        pinRows: T.boolean(),
        pinCols: T.boolean(),
        size: T.string({ defaultValue: "md", enum: Sizes }),
      },
      render: ({ rows, headers, zebra, pinRows, pinCols, size }) => {
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
                  `,
  )}
              </tbody>
            </table>
          </div>
        `;
      },
    },
    "uix-indicator": {
      // TODO: expand daisyui tags
      props: {
        content: T.string(),
        badge: T.string(),
        horizontalPosition: T.string({
          defaultValue: "end",
          enum: Positions,
        }),
        verticalPosition: T.string({
          defaultValue: "top",
          enum: Positions,
        }),
        responsivePositions: T.object(),
        badgeColor: T.string({ defaultValue: "secondary", enum: Colors }),
      },
      render: ({
        content,
        badge,
        horizontalPosition,
        verticalPosition,
        responsivePositions,
        badgeColor,
      }) => {
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
      },
    },
  },
});
