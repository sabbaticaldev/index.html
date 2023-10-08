import {
  BgColor,
  AlignX,
  AlignY,
  Gaps,
  Spacings,
  Sizes,
  Colors
} from "../style-props.mjs";

export default {
  views: {
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
          .filter(Boolean)
          .join(" ");

        return html`
          <div class=${baseClass} style="height: ${thickness};">
            <slot></slot>
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
    .filter(Boolean)
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
    .filter(Boolean)
    .join(" ")}
          >
            <slot></slot>
          </div>
        `;
      }
    }
  }
};
