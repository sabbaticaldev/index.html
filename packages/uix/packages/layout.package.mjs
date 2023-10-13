import {
  BgColor,
  AlignX,
  AlignY,
  Gaps,
  Spacings,
  Sizes,
  Colors,
} from "../uix.theme.mjs";

export default ({ T, html, dropzone }) => ({
  views: {
    "uix-block": {
      props: {
        color: T.string({ enum: Colors }),
        bgColor: T.string(),
        textColor: T.string(),
        spacing: T.number({ defaultValue: "md" }),
        rounded: T.boolean(),
        draggable: T.boolean(),
        shadow: T.boolean(),
        class: T.string(),
      },
      render: (props) => {
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
          error: "bg-error text-error-content",
        };

        const SpacingSizes = {
          xs: "p-1",
          sm: "p-2",
          md: "p-4",
          lg: "p-6",
          xl: "p-8",
          "2xl": "p-12",
          "3xl": "p-16",
          "4xl": "p-24",
        };
        const bgClass = bgColor ? `bg-${bgColor}` : "";
        const textClass = textColor ? `text-${textColor}` : "";
        const spacingClass = SpacingSizes[spacing || "md"];
        const colorClass = BlockColors[color];
        const roundedClass = rounded ? "rounded" : "";
        const shadowClass = shadow ? "shadow-md" : "";
        return html`
          <div
            draggable="true"
            class="${spacingClass} ${colorClass} ${bgClass} ${textClass} ${roundedClass} ${shadowClass} ${props.class}"
          >
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-stack": {
      props: {
        vertical: T.boolean(),
        gap: T.string({ defaultValue: "md", enum: Spacings }),
      },
      render: ({ vertical, gap }) => {
        const gapClass = Gaps[gap] || "";
        const directionClass = vertical ? "flex-col" : "flex-row";
        return html`
          <div class="stack flex ${directionClass} ${gapClass}">
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-divider": {
      props: {
        thickness: T.string({ defaultValue: "1px" }),
        color: T.string({ defaultValue: "primary", enum: Colors }),
        text: T.string(),
        vertical: T.boolean(),
        responsive: T.boolean(),
        class: T.string(),
      },

      render: (props) => {
        const { thickness, color, vertical, responsive } = props;
        const baseClass = [
          "divider",
          vertical ? "divider-vertical" : "divider-horizontal",
          responsive &&
            (vertical ? "lg:divider-horizontal" : "lg:divider-vertical"),
          BgColor[color],
          props.class,
        ]
          .filter(Boolean)
          .join(" ");

        return html`
          <div class=${baseClass} style="height: ${thickness};">
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-list": {
      props: {
        vertical: T.boolean(),
        responsive: T.boolean(),
        dropzone: T.boolean(),
        gap: T.string({ defaultValue: "sm", enum: Sizes }),
        rounded: T.boolean(),
        alignX: T.string({ enum: Object.keys(AlignX) }),
        alignY: T.string({ enum: Object.keys(AlignY) }),
        class: T.string(),
        id: T.string(),
      },
      ...dropzone,
      render: (props) => {
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
            id="uix-list"
            class=${[
    "flex",
    gapClass,
    directionClass,
    responsiveClass,
    borderRadiusClass,
    alignXClass,
    alignYClass,
    props.class,
  ]
    .filter(Boolean)
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      },
    },
    "uix-grid": {
      props: {
        templateColumns: T.string({ defaultValue: "1fr" }),
        templateRows: T.string(),
        gap: T.string({ defaultValue: "sm", enum: Sizes }),
        rounded: T.boolean(),
        alignX: T.string({ enum: Object.keys(AlignX) }),
        alignY: T.string({ enum: Object.keys(AlignY) }),
      },
      render: ({
        templateColumns,
        templateRows,
        gap,
        rounded,
        alignX,
        alignY,
      }) => {
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
    alignYClass,
  ]
    .filter(Boolean)
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      },
    },
  },
});
